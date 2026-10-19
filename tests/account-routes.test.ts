import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(), exchange: vi.fn(), from: vi.fn(), adminFrom: vi.fn(),
  checkout: vi.fn(), customer: vi.fn(), retrieve: vi.fn(), construct: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { getUser: mocks.getUser, exchangeCodeForSession: mocks.exchange }, from: mocks.from }) }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => ({ from: mocks.adminFrom }) }));
vi.mock("@/lib/stripe", () => ({
  PLANS: { free: { priceId: null }, starter: { priceId: "price_starter" }, pro: { priceId: "price_pro" }, business: { priceId: "price_business" } },
  getPlanFromPriceId: (price: string) => price === "price_pro" ? "pro" : "free",
  getStripe: () => ({ checkout: { sessions: { create: mocks.checkout } }, customers: { create: mocks.customer }, subscriptions: { retrieve: mocks.retrieve }, webhooks: { constructEvent: mocks.construct } }),
}));
import { POST as checkout } from "@/app/api/checkout/route";
import { GET as listKeys, POST as generateKey, DELETE as revokeKey } from "@/app/api/keys/route";
import { POST as webhook } from "@/app/api/webhooks/stripe/route";
import { GET as authCallback } from "@/app/auth/callback/route";

function query(result: object) {
  const chain: Record<string, unknown> = {};
  for (const method of ["select", "eq", "is", "order", "single", "maybeSingle", "insert", "update", "upsert"]) chain[method] = vi.fn(() => chain);
  chain.then = (resolve: (value: object) => unknown) => Promise.resolve(result).then(resolve);
  return chain;
}
function request(path: string, method = "POST", body: object = {}) {
  return new Request(`http://localhost:3000${path}`, { method, headers: { origin: "http://localhost:3000", "content-type": "application/json" }, ...(method === "GET" ? {} : { body: JSON.stringify(body) }) });
}
beforeEach(() => {
  vi.resetAllMocks();
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  mocks.getUser.mockResolvedValue({ data: { user: { id: "user-1", email: "test@example.com" } }, error: null });
});

describe("auth callback", () => {
  it("exchanges the code and redirects to the dashboard", async () => {
    mocks.exchange.mockResolvedValue({ error: null });
    const response = await authCallback(new Request("http://localhost:3000/auth/callback?code=test-code"));
    expect(mocks.exchange).toHaveBeenCalledWith("test-code");
    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });
  it("prevents redirecting to an external host", async () => {
    mocks.exchange.mockResolvedValue({ error: null });
    const response = await authCallback(new Request("http://localhost:3000/auth/callback?code=test&redirect=//evil.example"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });
  it("returns failed code exchanges to login", async () => {
    mocks.exchange.mockResolvedValue({ error: new Error("Expired code") });
    const response = await authCallback(new Request("http://localhost:3000/auth/callback?code=expired"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/login?error=auth_callback_failed");
  });
});

describe("checkout", () => {
  it("requires an authenticated user and rejects foreign origins", async () => {
    const foreign = new Request("http://localhost:3000/api/checkout", { method: "POST", headers: { origin: "https://foreign.example" } });
    expect((await checkout(foreign)).status).toBe(403);
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect((await checkout(request("/api/checkout", "POST", { plan: "pro" }))).status).toBe(401);
    expect(mocks.checkout).not.toHaveBeenCalled();
  });
  it("rejects unconfigured or conflicting prices", async () => {
    expect((await checkout(request("/api/checkout", "POST", { price_id: "price_attacker" }))).status).toBe(400);
    expect((await checkout(request("/api/checkout", "POST", { plan: "starter", price_id: "price_pro" }))).status).toBe(400);
    expect(mocks.checkout).not.toHaveBeenCalled();
  });
  it("uses the account's customer and redirects to Stripe", async () => {
    mocks.from.mockReturnValue(query({ data: { stripe_customer_id: "cus_1" }, error: null }));
    mocks.checkout.mockResolvedValue({ url: "https://checkout.stripe.com/test" });
    const response = await checkout(request("/api/checkout", "POST", { price_id: "price_pro" }));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://checkout.stripe.com/test");
    expect(mocks.checkout).toHaveBeenCalledWith(expect.objectContaining({ customer: "cus_1", line_items: [{ price: "price_pro", quantity: 1 }], subscription_data: { metadata: { userId: "user-1" } } }), expect.any(Object));
  });
  it("prevents starting checkout for an existing active subscription", async () => {
    mocks.from.mockReturnValue(query({ data: { stripe_subscription_id: "sub_1", status: "active" }, error: null }));
    expect((await checkout(request("/api/checkout", "POST", { plan: "pro" }))).status).toBe(409);
    expect(mocks.checkout).not.toHaveBeenCalled();
  });
});

describe("API keys", () => {
  it("stores only a hash and returns the secret once", async () => {
    const db = query({ data: { id: "key-1", name: "Production" }, error: null });
    mocks.adminFrom.mockReturnValue(db);
    const response = await generateKey(request("/api/keys", "POST", { name: " Production " }));
    const body = await response.json();
    expect(response.status).toBe(201);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body.key).toMatch(/^sk_live_[a-f0-9]{64}$/);
    expect(db.insert).toHaveBeenCalledWith({ user_id: "user-1", name: "Production", key_prefix: body.key.slice(0, 16), key_hash: createHash("sha256").update(body.key).digest("hex") });
  });
  it("lists metadata without selecting key hashes", async () => {
    const db = query({ data: [], error: null });
    mocks.from.mockReturnValue(db);
    expect((await listKeys(request("/api/keys", "GET"))).status).toBe(200);
    expect(db.select).toHaveBeenCalledWith("id, name, key_prefix, created_at, revoked_at");
    expect(db.eq).toHaveBeenCalledWith("user_id", "user-1");
  });
  it("scopes revocation to the owner and returns 404 for another user's key", async () => {
    const db = query({ data: null, error: null });
    mocks.adminFrom.mockReturnValue(db);
    const response = await revokeKey(request("/api/keys", "DELETE", { id: "11111111-1111-4111-8111-111111111111" }));
    expect(response.status).toBe(404);
    expect(db.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(db.is).toHaveBeenCalledWith("revoked_at", null);
  });
});

describe("Stripe webhook", () => {
  function delivery() { return new Request("http://localhost:3000/api/webhooks/stripe", { method: "POST", headers: { "stripe-signature": "signature" }, body: "raw-payload" }); }
  it("rejects missing and invalid signatures before accessing the database", async () => {
    expect((await webhook(request("/api/webhooks/stripe"))).status).toBe(400);
    mocks.construct.mockImplementation(() => { throw new Error("Bad signature"); });
    expect((await webhook(delivery())).status).toBe(400);
    expect(mocks.construct).toHaveBeenCalledWith("raw-payload", "signature", "whsec_test");
    expect(mocks.adminFrom).not.toHaveBeenCalled();
  });
  it.each(["checkout.session.completed", "customer.subscription.updated", "customer.subscription.deleted"])("syncs %s from current Stripe state", async type => {
    mocks.construct.mockReturnValue({ type, data: { object: type === "checkout.session.completed" ? { mode: "subscription", subscription: "sub_1" } : { id: "sub_1" } } });
    const canceled = type === "customer.subscription.deleted";
    mocks.retrieve.mockResolvedValue({ id: "sub_1", customer: "cus_1", status: canceled ? "canceled" : "active", items: { data: [{ price: { id: "price_pro" } }] }, current_period_end: 1800000000, cancel_at_period_end: false });
    const db = query({ data: { user_id: "user-1", stripe_subscription_id: "sub_1" }, error: null });
    mocks.adminFrom.mockReturnValue(db);
    expect((await webhook(delivery())).status).toBe(200);
    expect(db.upsert).toHaveBeenCalledWith(expect.objectContaining({ user_id: "user-1", stripe_customer_id: "cus_1", status: canceled ? "canceled" : "active", plan_name: canceled ? "free" : "pro" }), { onConflict: "user_id" });
  });
});

"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type ApiKey = { id: string; name: string; key_prefix: string; created_at: string; revoked_at: string | null };
export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [name, setName] = useState("");
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/keys", { signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setKeys(data.keys);
    }).catch(error => { if (!controller.signal.aborted) setError(error.message || "Unable to load keys."); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  async function mutate(id?: string) {
    if (id && !window.confirm("Revoke this API key? It will stop working immediately.")) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/keys", { method: id ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(id ? { id } : { name }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (id) setKeys(current => current.map(key => key.id === id ? { ...key, revoked_at: new Date().toISOString() } : key));
      else { setSecret(data.key); setKeys(current => [data.record, ...current]); setName(""); }
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to update keys."); }
    finally { setBusy(false); }
  }
  return <><h1 className="text-3xl font-bold">API Keys</h1><Card><CardHeader><CardTitle>Generate a key</CardTitle></CardHeader><CardContent className="space-y-4"><p>Keys grant access to your account. Keep them secret and revoke keys you no longer use.</p><form className="flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); void mutate(); }}><div className="space-y-2"><Label htmlFor="key-name">Key name</Label><Input id="key-name" required maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="Production server" /></div><Button disabled={busy || loading}>Generate key</Button></form>{secret && <div className="space-y-2 rounded border p-4"><p role="status">Copy this key now. You will not be able to see it again.</p><code className="block break-all select-all">{secret}</code><Button variant="outline" onClick={() => setSecret("")}>I’ve saved my key</Button></div>}{error && <p role="alert" className="text-destructive">{error}</p>}</CardContent></Card><Card><CardHeader><CardTitle>Your keys</CardTitle></CardHeader><CardContent>{loading ? <p role="status">Loading keys…</p> : keys.length ? <ul className="divide-y">{keys.map(key => <li key={key.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><p className="font-medium">{key.name}</p><code>{key.key_prefix}…</code><p className="text-sm text-muted-foreground">Created {new Date(key.created_at).toLocaleDateString()}{key.revoked_at ? " · Revoked" : " · Active"}</p></div>{!key.revoked_at && <Button variant="destructive" disabled={busy} onClick={() => mutate(key.id)}>Revoke</Button>}</li>)}</ul> : <p className="text-muted-foreground">No API keys yet.</p>}</CardContent></Card></>;
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function BillingActions({ hasCustomer, canCancel, canceling }: { hasCustomer: boolean; canCancel: boolean; canceling: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function cancel() {
    if (!window.confirm("Cancel your subscription at the end of this billing period?")) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/billing/cancel", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessage(data.message); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to cancel subscription."); }
    finally { setBusy(false); }
  }
  return <div className="space-y-3"><div className="flex flex-wrap gap-3">{hasCustomer && <form action="/api/billing/portal" method="post"><Button variant="outline">Manage payment & subscription</Button></form>}{canCancel && <Button variant="destructive" disabled={busy || canceling} onClick={cancel}>{canceling ? "Cancellation scheduled" : "Cancel subscription"}</Button>}</div><p role="status">{message}</p></div>;
}

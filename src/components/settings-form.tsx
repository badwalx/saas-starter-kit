"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function SettingsForm({ name: initialName, email }: { name: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent, deleting = false) {
    event.preventDefault();
    if (deleting && !window.confirm("Permanently delete your account and cancel all subscriptions? This cannot be undone.")) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/account", { method: deleting ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(deleting ? { confirmation } : { name }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (deleting) { window.location.assign("/"); return; }
      setMessage(data.message); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update account."); }
    finally { setBusy(false); }
  }
  return <><Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="max-w-md space-y-4"><div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" required maxLength={120} autoComplete="name" value={name} onChange={e => setName(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} readOnly /><p className="text-sm text-muted-foreground">Your email is managed by your authentication provider.</p></div><Button disabled={busy}>Save profile</Button></form></CardContent></Card><p role="status">{message}</p><Card className="border-destructive"><CardHeader><CardTitle>Danger zone</CardTitle></CardHeader><CardContent><p className="mb-4">Deleting your account permanently removes your data and API keys and cancels your subscriptions.</p><form onSubmit={event => submit(event, true)} className="max-w-md space-y-3"><Label htmlFor="confirmation">Type DELETE to confirm</Label><Input id="confirmation" value={confirmation} onChange={e => setConfirmation(e.target.value)} autoComplete="off" /><Button variant="destructive" disabled={busy || confirmation !== "DELETE"}>Delete account</Button></form></CardContent></Card></>;
}

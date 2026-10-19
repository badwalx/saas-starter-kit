"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true); setError("");
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      router.replace("/login"); router.refresh();
    } catch { setError("Unable to sign out. Try again."); }
    finally { setBusy(false); }
  }
  return <><nav aria-label="Dashboard" className="flex flex-col gap-2">
    {[["Overview", "/dashboard"], ["Settings", "/dashboard/settings"], ["Billing", "/dashboard/billing"], ["API Keys", "/dashboard/api-keys"]].map(([label, href]) => <Button key={href} variant={pathname === href ? "secondary" : "ghost"} className="justify-start" asChild><Link href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link></Button>)}
    </nav><Button className="mt-6" variant="outline" disabled={busy} onClick={signOut}>Sign out</Button>{error && <p role="alert">{error}</p>}</>;
}

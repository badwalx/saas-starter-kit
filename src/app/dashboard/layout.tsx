import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard-nav";
export const dynamic = "force-dynamic";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");
  return <div className="min-h-screen md:flex"><aside className="border-b p-6 md:w-64 md:shrink-0 md:border-r"><Link href="/" className="mb-8 block text-xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME || "YourSaaS"}</Link><DashboardNav /></aside><main className="min-w-0 flex-1 p-6 md:p-10"><div className="mx-auto max-w-5xl space-y-8">{children}</div></main></div>;
}

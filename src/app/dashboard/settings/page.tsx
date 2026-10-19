import { getDashboardData } from "@/lib/dashboard";
import { SettingsForm } from "@/components/settings-form";
export default async function SettingsPage() {
  const { user, profile } = await getDashboardData();
  return <><h1 className="text-3xl font-bold">Settings</h1><SettingsForm name={profile?.full_name ?? ""} email={user.email ?? ""} /></>;
}

"use client";
import { Button } from "@/components/ui/button";
export default function DashboardError({ reset }: { reset: () => void }) {
  return <div className="space-y-4" role="alert"><h1 className="text-2xl font-bold">Unable to load your dashboard</h1><p>Please try again. If this persists, contact support.</p><Button onClick={reset}>Try again</Button></div>;
}

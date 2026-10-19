"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ManageSubscriptionPage() {
  useEffect(() => {
    const redirectToPortal = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        const res = await fetch("/api/stripe/portal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        const { url } = await res.json();
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error("Portal redirect error:", error);
      }
    };

    redirectToPortal();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card>
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to Stripe...</p>
        </CardContent>
      </Card>
    </div>
  );
}

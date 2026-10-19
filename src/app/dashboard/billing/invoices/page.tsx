import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAmount } from "@/lib/stripe";
import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const statusVariant = (status: string) => {
    switch (status) {
      case "paid": return "success" as const;
      case "void": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-muted-foreground mt-1">
          Your billing history and invoices
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          {!invoices || invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Invoices will appear here once you subscribe to a paid plan.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Invoice</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-right py-3 px-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b last:border-0">
                      <td className="py-3 px-4 font-mono text-xs">
                        {invoice.stripe_invoice_id.slice(-8)}
                      </td>
                      <td className="py-3 px-4">
                        {formatAmount(invoice.amount_paid_cents)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {invoice.pdf_url && (
                          <Link
                            href={invoice.pdf_url}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            PDF <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

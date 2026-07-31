import { ExportCsvButton } from "@/features/admin/export-csv-button";
import {
  createSupabaseAdminClient,
  isAdminConfigured,
} from "@/lib/supabase/admin";

type SubscriberRow = {
  id: string;
  email: string;
  locale: string;
  confirmed: boolean;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  if (!isAdminConfigured()) {
    return (
      <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Set <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> to view
        subscribers here.
      </p>
    );
  }

  const { data } = await createSupabaseAdminClient()
    .from("newsletter_subs")
    .select("*")
    .order("created_at", { ascending: false });
  const subs = (data ?? []) as SubscriberRow[];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-fluid-xl text-navy">
          Subscribers{" "}
          <span className="text-muted-foreground">({subs.length})</span>
        </h2>
        <ExportCsvButton rows={subs} filename="subscribers.csv" />
      </div>

      {subs.length === 0 ? (
        <p className="text-muted-foreground">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Locale</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3 uppercase">{s.locale}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

import type { ReactNode } from "react";

import { BookingStatusControl } from "@/features/admin/booking-status-control";
import { ExportCsvButton } from "@/features/admin/export-csv-button";
import {
  createSupabaseAdminClient,
  isAdminConfigured,
} from "@/lib/supabase/admin";

type BookingRow = {
  id: string;
  reference: string;
  customer_name: string | null;
  customer_email: string | null;
  destination_slug: string;
  package_slug: string | null;
  start_date: string;
  end_date: string;
  guests: number;
  budget_tier: string;
  status: string;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  if (!isAdminConfigured()) {
    return <NotConfigured />;
  }

  const { data } = await createSupabaseAdminClient()
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  const bookings = (data ?? []) as BookingRow[];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-fluid-xl text-navy">
          Bookings{" "}
          <span className="text-muted-foreground">({bookings.length})</span>
        </h2>
        <ExportCsvButton rows={bookings} filename="bookings.csv" />
      </div>

      {bookings.length === 0 ? (
        <p className="text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <Th>Reference</Th>
                <Th>Customer</Th>
                <Th>Destination</Th>
                <Th>Dates</Th>
                <Th>Guests</Th>
                <Th>Tier</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 font-mono text-xs">{b.reference}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">
                      {b.customer_name ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {b.customer_email ?? ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {b.destination_slug.replace(/-/g, " ")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {b.start_date} → {b.end_date}
                  </td>
                  <td className="px-4 py-3">{b.guests}</td>
                  <td className="px-4 py-3 capitalize">{b.budget_tier}</td>
                  <td className="px-4 py-3">
                    <BookingStatusControl id={b.id} status={b.status} />
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

function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

function NotConfigured() {
  return (
    <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
      Set <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> in your
      environment to view and manage bookings here.
    </p>
  );
}

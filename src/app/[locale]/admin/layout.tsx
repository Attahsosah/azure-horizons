import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { SignOutButton } from "@/features/auth/sign-out-button";
import { getAdminUser } from "@/lib/auth/admin";
import { isLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

/**
 * Admin shell. Gated to allowlisted admins (ADMIN_EMAILS); everyone else is
 * bounced to sign-in. English-only — this is an internal tool.
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const admin = await getAdminUser();
  if (!admin) redirect(`/${locale}/sign-in`);

  const tabClass =
    "rounded-full border border-border px-4 py-2 hover:bg-secondary";

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-turquoise">
            Azure Horizons
          </p>
          <h1 className="font-display text-fluid-2xl text-navy">Admin</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{admin.email}</span>
          <SignOutButton locale={locale} label="Sign out" />
        </div>
      </header>

      <nav className="mb-8 flex flex-wrap gap-2 text-sm font-medium">
        <Link href={`/${locale}/admin`} className={tabClass}>
          Bookings
        </Link>
        <Link href={`/${locale}/admin/messages`} className={tabClass}>
          Messages
        </Link>
        <Link href={`/${locale}/admin/subscribers`} className={tabClass}>
          Subscribers
        </Link>
      </nav>

      {children}
    </div>
  );
}

"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  bookingSchema,
  contactSchema,
  newsletterSchema,
  type FormState,
} from "@/lib/validation/schemas";

export interface BookingResult {
  ok: boolean;
  reference?: string;
  error?: string;
}

/**
 * Creates a booking. Re-validates the whole draft server-side (defence beyond
 * the wizard's per-step checks) and returns a confirmation reference.
 * Persistence to `bookings` is wired via the Supabase adapter in Phase 8; today
 * it returns a generated reference so the flow is complete end to end.
 */
export async function createBooking(input: unknown): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const reference = `AZ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Persist for signed-in users when Supabase is configured; otherwise the
  // reference is still returned so the flow completes locally.
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const v = parsed.data;
      await supabase.from("bookings").insert({
        user_id: user.id,
        reference,
        destination_slug: v.destinationSlug,
        package_slug: v.packageSlug,
        start_date: v.startDate,
        end_date: v.endDate,
        guests: v.guests,
        budget_tier: v.budgetTier,
        status: "pending",
      });
    }
  }

  return { ok: true, reference };
}

/**
 * Server Actions for the marketing forms. They validate with Zod server-side
 * (defence in depth beyond the browser's native validation). Persistence is a
 * no-op today; the Supabase adapter wires `newsletter_subs` / `contact_messages`
 * writes here in Phase 8. Return shape drives `useActionState` in the UI.
 */
export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    locale: formData.get("locale"),
  });
  if (!parsed.success) return { ok: false, error: "invalid" };
  return { ok: true };
}

export async function sendContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { ok: false, error: "invalid" };
  return { ok: true };
}

"use server";

import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) return { error: "not_configured" };
  const locale = String(formData.get("locale") ?? "en");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) return { error: error.message };
  redirect(`/${locale}/account`);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) return { error: "not_configured" };
  const locale = String(formData.get("locale") ?? "en");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    options: {
      emailRedirectTo: `${siteUrl}/${locale}/auth/callback?next=/${locale}/account`,
    },
  });
  if (error) return { error: error.message };
  redirect(`/${locale}/sign-in?checkEmail=1`);
}

export async function signOut(formData: FormData): Promise<void> {
  const locale = String(formData.get("locale") ?? "en");
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect(`/${locale}`);
}

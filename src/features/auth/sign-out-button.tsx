import { signOut } from "@/lib/actions/auth";

/** Sign-out form button (server action, no client JS needed). */
export function SignOutButton({
  locale,
  label,
}: {
  locale: string;
  label: string;
}) {
  return (
    <form action={signOut}>
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
      >
        {label}
      </button>
    </form>
  );
}

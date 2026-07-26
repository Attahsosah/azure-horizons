import "server-only";

import type { Locale } from "./config";

/**
 * A translation dictionary: arbitrarily nested namespaces of strings.
 * Resolved by dot-path at the leaves (e.g. `hero.title`).
 */
export type Dictionary = { [key: string]: string | Dictionary };

/**
 * Server-only dictionary loader. Dictionaries are code-split per locale and
 * loaded on the server, then handed to the client provider for hydration.
 * Never bundle every language into the client.
 */
const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("../../../messages/en.json").then((m) => m.default),
  fr: () => import("../../../messages/fr.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}

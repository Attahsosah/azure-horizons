import type { ReactNode } from "react";

import { HeroCanvas } from "@/features/hero-3d/hero-canvas";
import { HeroPoster } from "@/features/hero-3d/hero-poster";

/**
 * Poster-first hero shell.
 *
 * Server Component: renders the static poster (LCP) and the content overlay
 * server-side for SEO, and mounts the WebGL scene as a lazy client island that
 * cross-fades in over the poster on capable devices.
 *
 * `children` is the localized headline/CTA block — passed from the page so it
 * stays server-rendered.
 */
export function Hero({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden">
      <HeroPoster className="z-0" />
      <HeroCanvas className="absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-24 text-center">
        {children}
      </div>
    </section>
  );
}

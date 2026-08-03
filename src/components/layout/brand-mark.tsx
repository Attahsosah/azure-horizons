import Image from "next/image";
import { Compass } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * Brand lockup used across the chrome. Renders the client's logo image when
 * `siteConfig.logo` is set (drop it in /public), otherwise a compass icon plus
 * the brand name. Text colour is inherited from the parent.
 */
export function BrandMark({ className }: { className?: string }) {
  if (siteConfig.logo) {
    return (
      <Image
        src={siteConfig.logo}
        alt={siteConfig.name}
        width={180}
        height={48}
        priority
        className={cn("h-9 w-auto", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex items-center gap-2 font-display text-lg font-semibold tracking-tight",
        className,
      )}
    >
      <Compass className="size-5 text-primary" aria-hidden="true" />
      {siteConfig.name}
    </span>
  );
}

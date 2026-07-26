import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Azure Horizons — Luxury Travel",
    short_name: "Azure Horizons",
    description:
      "Cinematic journeys to the world's most extraordinary destinations.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#0a2540",
    lang: "en",
  };
}

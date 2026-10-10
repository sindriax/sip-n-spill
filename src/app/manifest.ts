import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sip 'n Spill",
    short_name: "Sip 'n Spill",
    description: "The drinking game where you bet on what your friends have done.",
    start_url: "/",
    display: "standalone",
    background_color: "#120028",
    theme_color: "#120028",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

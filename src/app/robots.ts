import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/order-confirmation"],
      },
    ],
    sitemap: "https://erze-art.vercel.app/sitemap.xml",
  };
}

import { MetadataRoute } from "next";

const siteUrl = "https://hoshiapp.jp";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard", "/admin", "/api/"],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}

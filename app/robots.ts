import { Metadata, MetadataRoute } from "next";

export default function robots():MetadataRoute.Robots { 
    const baseUrl = "https://www.santehgorod.by/"
    return { 
        rules: { 
            userAgent: "*",
            allow: "/",
            disallow:["/api/", "/dashboard/", "/privacy-policy/"
            ]
        },
        sitemap: `${baseUrl}/sitemap.xml`
    }
}
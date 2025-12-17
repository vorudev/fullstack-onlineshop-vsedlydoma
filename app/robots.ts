import { Metadata, MetadataRoute } from "next";

export default function robots():MetadataRoute.Robots { 
    const baseUrl = "https://fullstack-onlineshop-vsedlydoma.vercel.app"
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
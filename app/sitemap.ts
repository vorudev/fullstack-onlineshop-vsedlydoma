import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap { 
    const baseUrl = "https://www.santehgorod.by/"
    return [{
url: `${baseUrl}/`,
lastModified: new Date(),
changeFrequency: "monthly",
priority: 1,
}, {
    url: `${baseUrl}/categories`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
}, {
    url: `${baseUrl}/manufacturers`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
}, 
{
    url: `${baseUrl}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
}, 
{
    url: `${baseUrl}/contact-us`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
}, 
{
    url: `${baseUrl}/product`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
}, {
    url: `${baseUrl}/profile`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
}, {
    url: `${baseUrl}/products`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
}, {
    url: `${baseUrl}/signin`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
}, {
    url: `${baseUrl}/signup`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
}, {
    url: `${baseUrl}/news`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
}, {
    url: `${baseUrl}/menu`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
}, {
    url: `${baseUrl}/cart`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
},  {
    url: `${baseUrl}/favorite`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
}, {
    url: `${baseUrl}/chechout`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
}, {
    url: `${baseUrl}/2fa`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
},  {
    url: `${baseUrl}/2fa-enable`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
}, {
    url: `${baseUrl}/reset-password`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
}, {
    url: `${baseUrl}/forgot-password`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
},  ]
}
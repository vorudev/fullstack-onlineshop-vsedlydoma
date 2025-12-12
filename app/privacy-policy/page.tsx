import { getPrivacyPolicy } from "@/lib/actions/law-actions";
import { SafeHtmlContent } from "./html-content";
export default async function PrivacyPolicy() {
    const privacyPolicy = await getPrivacyPolicy();
    return (
        <div className="container mx-auto px-4 py-8" >
            <h1>Политика конфиденциальности</h1>
             <div className="prose prose-sm max-w-none text-gray-700">
                <SafeHtmlContent html={privacyPolicy?.description || ''} />
                </div>
        </div>
    )
}
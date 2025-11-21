import ContactUsPage from "./client";
import { getContactUs } from "@/lib/actions/contact-us";

export default async function ContactUs() {
    const contactUs = await getContactUs();
    return <ContactUsPage contactUs={contactUs} />;
}
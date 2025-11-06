
import Header from "@/components/frontend/header";

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
    return (
    <>
    <Header />
    <div className="bg-gray-100">
           
            {children}
        </div>
    </>
)}
import Link from "next/link";

export default async function Home() {


  return (
     <div className="container mx-auto p-4  ">
      <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">зайти в панель администратора</Link>
    </div>
  );
}

import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="bg-white p-5 rounded-full ">
          <h1 className="text-6xl text-zinc-900 font-bold">Lycée Augustin</h1>
        </div>
      </main>
    </div>
  );
}

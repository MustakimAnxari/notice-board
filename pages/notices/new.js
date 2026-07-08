import Head from "next/head";
import Link from "next/link";
import NoticeForm from "@/components/NoticeForm";

export default function NewNotice() {
  return (
    <>
      <Head>
        <title>New notice - Notice Board</title>
      </Head>
      <main className="min-h-screen bg-[#f7f6f3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-800">
            &larr; Back to notices
          </Link>
          <h1 className="text-2xl font-bold text-stone-900 mt-3 mb-6">New notice</h1>
          <NoticeForm />
        </div>
      </main>
    </>
  );
}

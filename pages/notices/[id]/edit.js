import Head from "next/head";
import Link from "next/link";
import NoticeForm from "@/components/NoticeForm";
import prisma from "@/lib/prisma";

// Loads the notice server-side so the form always opens pre-filled with
// current values, even on a hard refresh / direct link.
export async function getServerSideProps({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return { notFound: true };

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) return { notFound: true };

  return { props: { notice: JSON.parse(JSON.stringify(notice)) } };
}

export default function EditNotice({ notice }) {
  return (
    <>
      <Head>
        <title>Edit notice - Notice Board</title>
      </Head>
      <main className="min-h-screen bg-[#f7f6f3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-800">
            &larr; Back to notices
          </Link>
          <h1 className="text-2xl font-bold text-stone-900 mt-3 mb-6">Edit notice</h1>
          <NoticeForm notice={notice} />
        </div>
      </main>
    </>
  );
}

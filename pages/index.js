import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import NoticeCard from "@/components/NoticeCard";
import prisma from "@/lib/prisma";

// Data is fetched server-side on every request (SSR) so the list always
// reflects the database and the Urgent-first ordering is computed by
// Prisma's orderBy, not by sorting in the browser.
export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });

  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
}

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);

  function handleDeleted(id) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <>
      <Head>
        <title>Notice Board</title>
        <meta name="description" content="Campus notice board" />
      </Head>

      <main className="min-h-screen bg-[#f7f6f3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Notice Board</h1>
              <p className="text-sm text-stone-500 mt-1">
                {notices.length} {notices.length === 1 ? "notice" : "notices"}
              </p>
            </div>
            <Link
              href="/notices/new"
              className="rounded-md bg-stone-900 text-white px-4 py-2 text-sm font-medium hover:bg-stone-700 shrink-0"
            >
              + New notice
            </Link>
          </header>

          {notices.length === 0 ? (
            <div className="text-center py-20 text-stone-500">
              <p className="text-lg font-medium text-stone-700">No notices yet</p>
              <p className="mt-1 text-sm">Post the first one to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {notices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} onDeleted={handleDeleted} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

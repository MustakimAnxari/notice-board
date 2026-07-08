import { useState } from "react";
import { useRouter } from "next/router";

const CATEGORY_STYLES = {
  Exam: "bg-amber-100 text-amber-800",
  Event: "bg-sky-100 text-sky-800",
  General: "bg-stone-100 text-stone-700",
};

function formatDate(value) {
  const d = new Date(value);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function NoticeCard({ notice, onDeleted }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isUrgent = notice.priority === "Urgent";

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted(notice.id);
      } else {
        setDeleting(false);
        setConfirming(false);
      }
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div
      className={`rounded-lg border bg-white p-5 shadow-sm flex flex-col gap-3 ${
        isUrgent ? "border-red-300 ring-1 ring-red-100" : "border-stone-200"
      }`}
    >
      {notice.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.imageUrl}
          alt=""
          className="w-full h-36 object-cover rounded-md"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-stone-900 leading-snug">{notice.title}</h3>
        {isUrgent && (
          <span className="shrink-0 rounded-full bg-red-600 text-white text-xs font-semibold px-2 py-0.5">
            Urgent
          </span>
        )}
      </div>

      <p className="text-sm text-stone-600 whitespace-pre-wrap line-clamp-4">{notice.body}</p>

      <div className="flex items-center gap-2 text-xs text-stone-500 mt-auto pt-2">
        <span className={`rounded-full px-2 py-0.5 font-medium ${CATEGORY_STYLES[notice.category]}`}>
          {notice.category}
        </span>
        <span>{formatDate(notice.publishDate)}</span>
      </div>

      <div className="flex gap-2 pt-2 border-t border-stone-100">
        <button
          onClick={() => router.push(`/notices/${notice.id}/edit`)}
          className="text-sm font-medium text-stone-700 hover:text-stone-900 px-2 py-1"
        >
          Edit
        </button>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="text-sm font-medium text-red-600 hover:text-red-800 px-2 py-1"
          >
            Delete
          </button>
        ) : (
          <span className="flex items-center gap-2 text-sm">
            <span className="text-stone-600">Delete this notice?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Yes"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="font-medium text-stone-500 hover:text-stone-700"
            >
              No
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

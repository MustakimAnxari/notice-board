import { useState } from "react";
import { useRouter } from "next/router";

const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

// One form, two jobs: creating a fresh notice (no `notice` prop) or editing
// an existing one (pass `notice` and it pre-fills every field).
export default function NoticeForm({ notice }) {
  const router = useRouter();
  const isEdit = Boolean(notice);

  const [title, setTitle] = useState(notice?.title ?? "");
  const [body, setBody] = useState(notice?.body ?? "");
  const [category, setCategory] = useState(notice?.category ?? "General");
  const [priority, setPriority] = useState(notice?.priority ?? "Normal");
  const [publishDate, setPublishDate] = useState(toDateInputValue(notice?.publishDate) || toDateInputValue(new Date()));
  const [imageUrl, setImageUrl] = useState(notice?.imageUrl ?? "");

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Light client-side check purely for UX. The API route re-validates
  // everything server-side regardless of what happens here.
  function clientValidate() {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required.";
    if (!body.trim()) errs.body = "Body is required.";
    if (!publishDate) errs.publishDate = "Publish date is required.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const errs = clientValidate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const payload = { title, body, category, priority, publishDate, imageUrl };

    try {
      const res = await fetch(isEdit ? `/api/notices/${notice.id}` : "/api/notices", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFieldErrors(data.fieldErrors ?? {});
        setFormError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push("/");
    } catch (err) {
      setFormError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {formError && (
        <p className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {formError}
        </p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-800"
          placeholder="e.g. Mid-semester exam schedule released"
        />
        {fieldErrors.title && <p className="text-sm text-red-600 mt-1">{fieldErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-stone-700 mb-1">
          Body
        </label>
        <textarea
          id="body"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-800"
          placeholder="Full details of the notice"
        />
        {fieldErrors.body && <p className="text-sm text-red-600 mt-1">{fieldErrors.body}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-800"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-stone-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-800"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="publishDate" className="block text-sm font-medium text-stone-700 mb-1">
          Publish date
        </label>
        <input
          id="publishDate"
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-800"
        />
        {fieldErrors.publishDate && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.publishDate}</p>
        )}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-stone-700 mb-1">
          Image URL <span className="text-stone-400 font-normal">(optional)</span>
        </label>
        <input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-800"
          placeholder="https://..."
        />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-2 h-32 w-full max-w-xs object-cover rounded-md border border-stone-200"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-stone-900 text-white px-5 py-2 text-sm font-medium hover:bg-stone-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Publish notice"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-md border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

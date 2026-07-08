const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

// Server-side validation. Returns { valid, errors, data } where data holds
// the cleaned/coerced fields ready to hand to Prisma. This runs inside the
// API route regardless of whatever validation the form already did in the
// browser, per the assignment's "validate on the server" requirement.
export function validateNotice(body) {
  const errors = {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const noticeBody = typeof body.body === "string" ? body.body.trim() : "";
  const category = body.category;
  const priority = body.priority;
  const publishDateRaw = body.publishDate;
  const imageUrl =
    typeof body.imageUrl === "string" && body.imageUrl.trim() !== ""
      ? body.imageUrl.trim()
      : null;

  if (!title) errors.title = "Title is required.";
  if (!noticeBody) errors.body = "Body is required.";
  if (!CATEGORIES.includes(category)) errors.category = "Category must be Exam, Event, or General.";
  if (!PRIORITIES.includes(priority)) errors.priority = "Priority must be Normal or Urgent.";

  let publishDate = null;
  if (!publishDateRaw) {
    errors.publishDate = "Publish date is required.";
  } else {
    const parsed = new Date(publishDateRaw);
    if (Number.isNaN(parsed.getTime())) {
      errors.publishDate = "Publish date must be a valid date.";
    } else {
      publishDate = parsed;
    }
  }

  const valid = Object.keys(errors).length === 0;

  return {
    valid,
    errors,
    data: valid
      ? { title, body: noticeBody, category, priority, publishDate, imageUrl }
      : null,
  };
}

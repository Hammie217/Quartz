import { QuartzPluginData } from "../plugins/vfile"
import { FilePath, slugifyFilePath } from "./path"

export const contentTypes = [
  "page",
  "article",
  "project",
  "case-study",
  "knowledge-note",
  "activity",
] as const
export type ContentType = (typeof contentTypes)[number]
export const typeLabels: Record<ContentType, string> = {
  page: "Page",
  article: "Article",
  project: "Project",
  "case-study": "Case study",
  "knowledge-note": "Knowledge note",
  activity: "Activity",
}
export const text = (value: unknown): string => (typeof value === "string" ? value : "")
export const strings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : typeof value === "string"
      ? [value]
      : []
export const key = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
export function contentType(file: QuartzPluginData): ContentType {
  const type = file.frontmatter?.type as string | undefined
  if (type === "event") return "activity"
  if (type === "knowledge") return "knowledge-note"
  return contentTypes.includes(type as ContentType) ? (type as ContentType) : "page"
}
export const isArticle = (file: QuartzPluginData) => contentType(file) === "article"
export const isNote = (file: QuartzPluginData) => contentType(file) === "knowledge-note"
export function isPublic(file: QuartzPluginData) {
  const fm = file.frontmatter
  return (
    fm?.draft !== true &&
    fm?.draft !== "true" &&
    fm?.private !== true &&
    fm?.private !== "true" &&
    fm?.publish !== false &&
    fm?.publish !== "false"
  )
}
export function contentDate(file: QuartzPluginData): Date | undefined {
  const fm = file.frontmatter
  const value =
    contentType(file) === "activity" ? (fm?.eventDate ?? fm?.date) : (fm?.date ?? fm?.published)
  const date = value ? new Date(String(value)) : undefined
  return date && Number.isFinite(date.getTime()) ? date : undefined
}
export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
export function byRecent(a: QuartzPluginData, b: QuartzPluginData) {
  return (
    (contentDate(b)?.getTime() ?? 0) - (contentDate(a)?.getTime() ?? 0) ||
    String(a.slug).localeCompare(String(b.slug))
  )
}
export function collection(files: QuartzPluginData[], type: ContentType) {
  return files.filter((f) => isPublic(f) && contentType(f) === type).sort(byRecent)
}
export const articles = (files: QuartzPluginData[]) => collection(files, "article")
export function featuredItems(files: QuartzPluginData[], limit = 3, fallback = true) {
  const publicFiles = files.filter(isPublic)
  const featured = publicFiles.filter((f) => f.frontmatter?.featured === true)
  const order = (f: QuartzPluginData) =>
    typeof f.frontmatter?.featuredOrder === "number" && Number.isFinite(f.frontmatter.featuredOrder)
      ? f.frontmatter.featuredOrder
      : Infinity
  return (
    featured.length
      ? featured.sort((a, b) => order(a) - order(b) || byRecent(a, b))
      : fallback
        ? [...publicFiles].sort(byRecent)
        : []
  ).slice(0, limit)
}
export function articleInfo(file: QuartzPluginData) {
  return {
    category: text(file.frontmatter?.category),
    description:
      file.frontmatter?.description ||
      (file.description ?? file.text ?? "").replace(/\s+/g, " ").slice(0, 180),
    featured: file.frontmatter?.featured === true,
  }
}
export function topicKeys(file: QuartzPluginData) {
  return [
    ...new Set([...strings(file.frontmatter?.topics), ...strings(file.frontmatter?.tags)].map(key)),
  ]
}
export function topicDefinitions(files: QuartzPluginData[]) {
  const definitions = files
    .filter((f) => f.frontmatter?.view === "topic" && isPublic(f))
    .map((f) => ({
      id: key(text(f.frontmatter?.topic)),
      title: f.frontmatter!.title,
      description: f.frontmatter?.description ?? "",
      slug: f.slug!,
    }))
  // New tags/categories are discoverable without creating another topic page.
  const known = new Set(definitions.map((t) => t.id))
  for (const file of files.filter(isNote).filter(isPublic)) {
    for (const label of [
      ...strings(file.frontmatter?.topics),
      text(file.frontmatter?.category),
    ].filter(Boolean)) {
      const id = key(label)
      if (!known.has(id)) {
        definitions.push({
          id,
          title: label,
          description: "",
          slug: "knowledge/index" as typeof file.slug & string,
        })
        known.add(id)
      }
    }
  }
  return definitions.sort((a, b) => a.title.localeCompare(b.title))
}
export function belongsToTopic(file: QuartzPluginData, id: string) {
  return topicKeys(file).includes(key(id)) || key(text(file.frontmatter?.category)) === key(id)
}
export const topicNotes = (files: QuartzPluginData[], id: string) =>
  collection(files, "knowledge-note")
    .filter((f) => belongsToTopic(f, id))
    .sort((a, b) => a.frontmatter!.title.localeCompare(b.frontmatter!.title))

const canonical = (value: string) =>
  String(
    slugifyFilePath(
      value
        .replace(/^\[\[/, "")
        .replace(/\]\]$/, "")
        .split("|")[0]
        .split("#")[0]
        .replace(/^\/+/, "") as FilePath,
    ),
  )
    .replace(/\/index$/, "")
    .replace(/\/$/, "")
export function relatedContent(current: QuartzPluginData, files: QuartzPluginData[], limit = 4) {
  const candidates = files.filter(
    (f) => isPublic(f) && f.slug !== current.slug && contentType(f) !== "page",
  )
  const result: QuartzPluginData[] = []
  const add = (f: QuartzPluginData) => {
    if (!result.some((r) => r.slug === f.slug)) result.push(f)
  }
  for (const ref of strings(current.frontmatter?.related)) {
    const matches = candidates.filter(
      (f) =>
        canonical(f.slug!) === canonical(ref) ||
        strings(f.frontmatter?.aliases).some((a) => canonical(a) === canonical(ref)) ||
        f.frontmatter?.title === ref,
    )
    if (matches.length === 1) add(matches[0])
  }
  const generic = new Set([
    "engineering",
    "technology",
    "manufacturing",
    "article",
    "project",
    "knowledge-note",
  ])
  const tags = topicKeys(current).filter((tag) => !generic.has(tag))
  const score = (f: QuartzPluginData) => topicKeys(f).filter((t) => tags.includes(t)).length
  candidates
    .filter((f) => score(f) > 0)
    .sort((a, b) => score(b) - score(a) || byRecent(a, b))
    .forEach(add)
  const category = key(text(current.frontmatter?.category))
  if (category)
    candidates
      .filter((f) => key(text(f.frontmatter?.category)) === category)
      .sort(byRecent)
      .forEach(add)
  return result.slice(0, limit)
}
export function activityGroup(file: QuartzPluginData, now = new Date()) {
  const fm = file.frontmatter
  const status = key(text(fm?.status))
  const end = fm?.endDate ? new Date(String(fm.endDate)) : contentDate(file)
  if (status === "ongoing") return "Ongoing involvement"
  if (
    end &&
    end.getTime() >= Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) &&
    !["completed", "cancelled", "published"].includes(status)
  )
    return "Upcoming"
  const type = key(text(fm?.activityType))
  if (type === "speaking") return "Past speaking"
  if (type === "mentoring") return "Mentoring"
  return "Other professional activity"
}

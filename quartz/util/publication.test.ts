import { test } from "node:test"
import assert from "node:assert/strict"
import {
  activityGroup,
  collection,
  featuredItems,
  relatedContent,
  topicNotes,
  recommendedReading,
  caseStudiesForRole,
  usesKnowledgeLayout,
  contentSection,
} from "./publication"
import { QuartzPluginData } from "../plugins/vfile"

const doc = (slug: string, metadata: Record<string, unknown> = {}) =>
  ({
    slug,
    frontmatter: { title: slug, type: "article", tags: [], ...metadata },
  }) as unknown as QuartzPluginData

test("collections exclude draft/private and sort chronologically", () => {
  const files = [
    doc("old", { date: "2020-01-01" }),
    doc("new", { date: "2025-01-01" }),
    doc("draft", { draft: true }),
    doc("private", { private: "true" }),
    doc("hidden", { publish: false }),
  ]
  assert.deepEqual(
    collection(files, "article").map((f) => f.slug),
    ["new", "old"],
  )
})
test("featured order wins, ties and fallback are deterministic", () => {
  const files = [
    doc("b", { featured: true, featuredOrder: 2 }),
    doc("c", { featured: true, featuredOrder: 1 }),
    doc("a", { featured: true, featuredOrder: 1 }),
    doc("hidden", { featured: true, draft: true, featuredOrder: 0 }),
  ]
  assert.deepEqual(
    featuredItems(files).map((f) => f.slug),
    ["a", "c", "b"],
  )
  assert.equal(
    featuredItems([doc("old", { date: "2020-01-01" }), doc("new", { date: "2025-01-01" })])[0].slug,
    "new",
  )
  assert.deepEqual(featuredItems([doc("none")], 3, false), [])
})
test("related prioritises explicit references and specific tags without category filler", () => {
  const current = doc("self", { related: ["[[explicit.md]]"], tags: ["mqtt"], category: "Data" })
  const files = [
    current,
    doc("tag", { tags: ["mqtt"] }),
    doc("category", { category: "Data" }),
    doc("explicit"),
    doc("unrelated"),
    doc("private", { private: true, tags: ["mqtt"] }),
  ]
  assert.deepEqual(
    relatedContent(current, files).map((f) => f.slug),
    ["explicit", "tag"],
  )
  assert.deepEqual(relatedContent(doc("isolated"), files), [])
})
test("topics work independent of source folders", () => {
  assert.equal(
    topicNotes([doc("anywhere", { type: "knowledge-note", topics: ["New Topic"] })], "new-topic")
      .length,
    1,
  )
})
test("activities group by dates and status", () => {
  const now = new Date("2026-01-01")
  assert.equal(
    activityGroup(doc("a", { type: "activity", eventDate: "2026-06-01" }), now),
    "Upcoming",
  )
  assert.equal(
    activityGroup(doc("b", { activityType: "Speaking", status: "Completed" }), now),
    "Past speaking",
  )
  assert.equal(activityGroup(doc("c", { status: "Ongoing" }), now), "Ongoing involvement")
})

test("professional records use a quiet layout and content-aware sections", () => {
  for (const type of ["project", "activity", "case-study"])
    assert.equal(usesKnowledgeLayout(doc("elsewhere", { type })), false)
  assert.equal(usesKnowledgeLayout(doc("article")), true)
  assert.equal(contentSection(doc("unusual/path", { type: "case-study" }))?.slug, "work/index")
})
test("activity relationships are explicit only; broad topics and categories do not fill", () => {
  const files = [
    doc("note", { tags: ["mqtt"], category: "Strategy" }),
    doc("event", { type: "activity", tags: ["mqtt"] }),
  ]
  assert.deepEqual(relatedContent(doc("current", { type: "activity", tags: ["mqtt"] }), files), [])
  assert.deepEqual(
    relatedContent(doc("current", { type: "activity", related: ["note"] }), files).map(
      (f) => f.slug,
    ),
    ["note"],
  )
  assert.deepEqual(
    relatedContent(
      doc("current", { category: "Strategy", topics: ["strategy-governance"] }),
      files,
    ),
    [],
  )
  assert.deepEqual(relatedContent(doc("current", { tags: ["mqtt"] }), [files[1]]), [])
})
test("curated reading respects order, aliases, public visibility and deduplication", () => {
  const files = [
    doc("b", { type: "knowledge-note", topics: ["new"], aliases: ["old-b"] }),
    doc("a", { type: "knowledge-note", topics: ["new"] }),
    doc("private", { private: true }),
  ]
  assert.deepEqual(
    recommendedReading(
      doc("topic", { recommended: ["old-b", "a", "b", "private", "missing"] }),
      files,
    ).map((f) => f.slug),
    ["b", "a"],
  )
  assert.deepEqual(
    recommendedReading(doc("topic", { topic: "new" }), files).map((f) => f.slug),
    ["a", "b"],
  )
})
test("employment associations include only matching published case studies", () => {
  const files = [
    doc("case", { type: "case-study", employmentId: "role-a" }),
    doc("draft", { type: "case-study", employmentId: "role-a", draft: true }),
    doc("article", { employmentId: "role-a" }),
  ]
  assert.deepEqual(
    caseStudiesForRole(files, "role-a").map((f) => f.slug),
    ["case"],
  )
  assert.deepEqual(caseStudiesForRole(files, ""), [])
})

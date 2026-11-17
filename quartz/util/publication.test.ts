import { test } from "node:test"
import assert from "node:assert/strict"
import { activityGroup, collection, featuredItems, relatedContent, topicNotes } from "./publication"
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
test("related prioritises explicit references, tags, then category without filler", () => {
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
    ["explicit", "tag", "category"],
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

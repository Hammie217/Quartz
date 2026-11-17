import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
const root = fs.mkdtempSync(path.join(os.tmpdir(), "quartz-content-test-"))
const content = path.join(root, "content"),
  output = path.join(root, "public")
fs.cpSync("content", content, { recursive: true })
const write = (name, text) => {
  const p = path.join(content, name)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, text)
}
for (const [type, folder] of [
  ["project", "projects"],
  ["article", "insights"],
  ["case-study", "work/case-studies"],
  ["knowledge-note", "knowledge"],
  ["activity", "activities"],
]) {
  write(
    folder + "/fixture-" + type + ".md",
    `---
title: Fixture ${type}
type: ${type}
description: Integration fixture, never published.
publish: true
draft: false
featured: true
featuredOrder: -100
date: "2026-01-01"
category: Guides
tags: [fixture]
topics: [fixture]
employmentId: global-ot-integration
activityType: Speaking
eventDate: "2099-01-01"
thumbnail: assets/fixture.svg
---
## Fixture heading

[[Notes/Digital/MQTT]]

![Image](../assets/fixture.svg)

## Second heading

Fixture body.

## Third heading

More detail.
`,
  )
}
write(
  "assets/fixture.svg",
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>',
)
write("assets/draft-only.svg", '<svg xmlns="http://www.w3.org/2000/svg"/>')
write(
  "insights/fixture-draft.md",
  "---\ntitle: Secret Fixture\ntype: article\npublish: true\ndraft: true\nthumbnail: assets/draft-only.svg\n---\nPrivate draft.",
)
execFileSync(process.execPath, ["quartz/bootstrap-cli.mjs", "build", "-d", content, "-o", output], {
  stdio: "inherit",
})
const html = (route) => fs.readFileSync(path.join(output, route + ".html"), "utf8")
for (const [route, label] of [
  ["projects/index", "Fixture project"],
  ["insights/index", "Fixture article"],
  ["work/index", "Fixture case-study"],
  ["knowledge/index", "Fixture knowledge-note"],
  ["about/index", "Fixture activity"],
  ["about/speaking/index", "Fixture activity"],
  ["about/involvement", "Fixture activity"],
  ["index", "Fixture project"],
]) {
  assert(html(route).includes(label), route + " missing " + label)
}
assert(!fs.existsSync(path.join(output, "insights/fixture-draft.html")))
assert(fs.existsSync(path.join(output, "assets/fixture.svg")))
assert(!fs.existsSync(path.join(output, "assets/draft-only.svg")))
const index = JSON.parse(fs.readFileSync(path.join(output, "static/contentIndex.json"), "utf8"))
assert.equal(index["projects/fixture-project"].type, "project")
assert(!index["insights/fixture-draft"])
assert(index["projects/fixture-project"].links.includes("Notes/Digital/MQTT"))
assert(html("projects/fixture-project").includes("reading-toc"))
assert(html("projects/fixture-project").includes("Related"))
console.log(
  "Fixture build passed: automatic collections, activity reuse, related content, TOC, wikilinks, typed search and draft/asset exclusion.",
)
console.log("Fixture output: " + output)

// Professional records must not inherit knowledge sidebars or activity recommendations.
for (const [type, folder] of [
  ["activity", "activities"],
  ["project", "projects"],
  ["case-study", "work/case-studies"],
]) {
  const page = html(folder + "/fixture-" + type)
  assert(page.includes('data-layout="portfolio"'))
  assert(!page.includes('class="contextual-graph"'))
  assert(!page.includes('class="backlinks"'))
  assert(page.includes(type + "-content"))
}
assert(!html("activities/fixture-activity").includes('aria-label="Related content"'))
assert(html("work/index").includes('aria-label="Case studies for this role"'))
assert(html("index").includes("Fixture case-study"))
assert(html("insights/index").includes("Filter by category"))
assert(!html("insights/index").includes("Filter by topic"))
execFileSync(process.execPath, ["scripts/check-build-consistency.mjs", output], {
  stdio: "inherit",
})

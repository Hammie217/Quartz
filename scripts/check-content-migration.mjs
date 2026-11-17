import assert from "node:assert/strict"
import fs from "node:fs"
import crypto from "node:crypto"
import matter from "gray-matter"
const report = JSON.parse(fs.readFileSync("docs/refactor-migration.json", "utf8"))
const index = JSON.parse(fs.readFileSync("public/static/contentIndex.json", "utf8"))
for (const entry of report.documents) {
  const body = matter(fs.readFileSync("content/" + entry.file, "utf8")).content
  assert.equal(
    crypto.createHash("sha256").update(body).digest("hex"),
    entry.bodyHash,
    entry.file + " body changed",
  )
  assert.equal(entry.oldUrl, entry.newUrl)
  assert(fs.existsSync("public/" + entry.newUrl + ".html"), entry.file + " missing page")
  assert(index[entry.newUrl], entry.file + " missing search entry")
  assert(index[entry.newUrl].type, entry.file + " missing type")
}
assert(!fs.existsSync("content/" + report.preservedDeletion))
assert(!fs.existsSync("public/Recordings/Recordings.html"))
assert(!Object.keys(index).some((k) => k.startsWith("Draft/")))
console.log(
  "Verified " +
    report.documents.length +
    " unchanged Markdown bodies, stable URLs and typed search entries; deletion and draft exclusion preserved.",
)

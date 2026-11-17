import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { rehype } from "rehype"
import { visit } from "unist-util-visit"

const output = path.resolve(process.argv[2] ?? "public")
const build = JSON.parse(fs.readFileSync(path.join(output, "build-info.json"), "utf8"))
assert(build.buildId, "Missing build identity")
function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(file)
    else if (file.endsWith(".html")) yield file
  }
}
let pages = 0
for (const file of walk(output)) {
  const html = fs.readFileSync(file, "utf8")
  const nodes = []
  visit(rehype().parse(html), "element", (node) => {
    nodes.push(node)
  })
  const meta = (name) =>
    nodes.find((n) => n.tagName === "meta" && n.properties.name === name)?.properties.content
  assert.equal(meta("quartz-build"), build.buildId, file + ": mixed build")
  const redirect = nodes.some((n) => String(n.properties.httpEquiv).toLowerCase() === "refresh")
  if (!redirect) {
    assert(
      nodes.some((n) => n.tagName === "a" && /(?:^|\/)projects\/$/.test(String(n.properties.href))),
      file + ": Projects navigation missing",
    )
    for (const asset of ["index.css", "prescript.js", "postscript.js"]) {
      const node = nodes.find((n) => String(n.properties.src ?? n.properties.href).includes(asset))
      assert(node, file + ": missing " + asset)
      const url = new URL(
        String(node.properties.src ?? node.properties.href),
        "https://test.invalid/",
      )
      assert.equal(url.searchParams.get("v"), build.buildId, file + ": stale asset version")
      assert(fs.existsSync(path.join(output, asset)))
    }
    assert(
      html.includes("static/contentIndex.json?v=" + build.buildId),
      file + ": unversioned search index",
    )
  }
  pages++
}
assert(!fs.existsSync(path.join(output, "Draft")), "Draft output must not be deployed")
console.log(
  "Validated one build identity and versioned assets across " + pages + " generated pages.",
)

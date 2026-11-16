import assert from "node:assert/strict"
import { existsSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { rehype } from "rehype"
import { visit } from "unist-util-visit"

// Run after a build. Exercise real generated pages and both deployment URL shapes.
const output = path.resolve(process.argv[2] ?? "public")
const pages = [
  "index.html",
  "work/index.html",
  "about/index.html",
  "about/speaking/index.html",
  "insights/index.html",
  "knowledge/index.html",
  "contact/index.html",
  ...[
    "manufacturing-systems",
    "industrial-connectivity",
    "software-infrastructure",
    "data-analytics",
    "pharmaceutical-engineering",
    "strategy-governance",
  ].map((t) => `knowledge/${t}/index.html`),
]
const elements = (file) => {
  const nodes = []
  visit(rehype().parse(readFileSync(path.join(output, file), "utf8")), "element", (node) => {
    nodes.push(node)
  })
  return nodes
}
const fileAt = (relativePath) => {
  const candidates = [relativePath, `${relativePath}.html`, path.join(relativePath, "index.html")]
  return candidates.find((candidate) => {
    const absolute = path.resolve(output, candidate)
    return (
      absolute.startsWith(output + path.sep) && existsSync(absolute) && statSync(absolute).isFile()
    )
  })
}

let checkedLinks = 0
for (const file of pages) {
  const nodes = elements(file)
  assert.equal(
    nodes.find((node) => node.tagName === "body")?.properties.dataLayout,
    "portfolio",
    file,
  )
  assert.equal(
    nodes.filter((node) => node.tagName === "h1").length,
    1,
    `${file}: single main heading`,
  )
  assert(
    nodes.some((node) => node.tagName === "main" && node.properties.id === "main-content"),
    file,
  )
  assert(
    nodes.some(
      (node) =>
        node.tagName === "meta" &&
        node.properties.name === "description" &&
        node.properties.content,
    ),
    file,
  )
  assert(
    nodes.some(
      (node) =>
        node.tagName === "link" &&
        node.properties.rel?.includes("canonical") &&
        node.properties.href.startsWith("https://hammie217.github.io/Quartz/"),
    ),
    `${file}: canonical base path`,
  )
  for (const node of nodes) {
    const classes = node.properties.className ?? []
    if (classes.includes("project-card") || classes.includes("insight-card")) {
      assert(
        node.children.some((child) => child.tagName === "h3"),
        `${file}: card heading stays inside its link`,
      )
      assert(
        node.children.some((child) => child.tagName === "p"),
        `${file}: card copy stays inside its link`,
      )
    }
    assert(
      !classes.some((name) => ["graph", "backlinks", "giscus"].includes(name)),
      `${file}: no technical clutter`,
    )
  }

  const socialImage = nodes.find((node) => node.properties.property === "og:image")?.properties
    .content
  assert(socialImage, `${file}: social preview image`)
  const socialPath = new URL(socialImage).pathname.replace(/^\/Quartz\//, "")
  assert(fileAt(socialPath), `${file}: social preview image exists`)

  for (const base of ["http://127.0.0.1:8080/", "https://hammie217.github.io/Quartz/"]) {
    const baseUrl = new URL(base)
    const pagePath =
      file === "index.html" ? "" : file.replace(/index\.html$/, "").replace(/\.html$/, "")
    const current = new URL(pagePath, base)
    for (const node of nodes) {
      const target =
        node.tagName === "a"
          ? node.properties.href
          : ["img", "script"].includes(node.tagName)
            ? node.properties.src
            : node.tagName === "link" && node.properties.rel?.includes("stylesheet")
              ? node.properties.href
              : undefined
      if (typeof target !== "string" || target.startsWith("#")) continue
      const url = new URL(target, current)
      if (url.origin !== baseUrl.origin) continue
      assert(
        url.pathname.startsWith(baseUrl.pathname),
        `${file}: link escapes base path: ${target}`,
      )
      const relative = decodeURIComponent(url.pathname.slice(baseUrl.pathname.length))
      assert(fileAt(relative), `${file}: missing internal target ${target} (${relative})`)
      checkedLinks++
    }
  }
}

for (const file of ["Posts/Kubernetes-Overview.html", "Notes/Digital/MQTT.html"]) {
  const nodes = elements(file)
  assert.equal(nodes.find((node) => node.tagName === "body")?.properties.dataLayout, "knowledge")
  for (const name of [
    "contextual-graph",
    "graph-container",
    "explore-graph",
    "backlinks",
    "explorer",
    "search",
  ]) {
    assert(
      nodes.some((node) => node.properties.className?.includes(name)),
      `${file}: ${name} retained`,
    )
  }
  const localGraph = nodes.find((node) => node.properties.className?.includes("graph-container"))
  assert.equal(
    JSON.parse(localGraph.properties.dataCfg).depth,
    1,
    `${file}: contextual graph shows neighbouring notes`,
  )
  assert(
    nodes.some((node) => node.properties.className?.includes("global-graph-icon")),
    `${file}: graph can expand`,
  )
}
for (const alias of [
  "me",
  "about",
  "contact",
  "insights",
  "experience",
  "projects/index",
  "projects/factory-integration",
  "projects/barnard-castle",
  "projects/equipment-ontology",
]) {
  assert(existsSync(path.join(output, alias + ".html")), `Historical alias ${alias} retained`)
  assert(
    elements(alias + ".html").some((n) => n.properties.httpEquiv?.includes("refresh")),
    alias,
  )
}
assert(
  elements("knowledge/graph/index.html").some((n) => n.properties.className?.includes("graph")),
  "Graph retained on dedicated page",
)
const graphContainer = elements("knowledge/graph/index.html").find((n) =>
  n.properties.className?.includes("graph-container"),
)
assert.equal(
  JSON.parse(graphContainer.properties.dataCfg).depth,
  -1,
  "Dedicated graph includes the whole knowledge base",
)
console.log(
  `Validated ${pages.length} portfolio pages and ${checkedLinks} local URLs across root and /Quartz/ hosting. Technical navigation and historical aliases are retained.`,
)

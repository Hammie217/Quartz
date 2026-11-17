import { FilePath, joinSegments, slugifyFilePath } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import path from "node:path"
import fs from "node:fs"
import { visit } from "unist-util-visit"
import { glob } from "../../util/glob"
import manifest from "../../publication-manifest.json"

// Only assets referenced by published content are promoted, alongside the legacy allowlist.
export const Assets: QuartzEmitterPlugin = () => ({
  name: "Assets",
  async *emit({ argv, cfg }, content) {
    const approved = new Set(manifest.assets.map((fp) => String(slugifyFilePath(fp as FilePath))))
    for (const [tree, file] of content) {
      const approve = (value: unknown, root = false) => {
        if (typeof value !== "string" || /^(?:[a-z]+:|\/\/)/i.test(value)) return
        try {
          const base = root ? "/" : "/" + file.data.slug
          const url = new URL(value, "https://assets.invalid" + base)
          const candidate = decodeURIComponent(url.pathname).replace(/^\//, "")
          if (candidate.startsWith("assets/"))
            approved.add(String(slugifyFilePath(candidate as FilePath)))
        } catch {
          /* Invalid references are not promoted. */
        }
      }
      approve(file.data.frontmatter?.thumbnail, true)
      visit(tree, "element", (node) => {
        approve(node.properties.src)
        approve(node.properties.href)
      })
    }
    const files = await glob("**", argv.directory, ["**/*.md", ...cfg.configuration.ignorePatterns])
    for (const fp of files) {
      const name = slugifyFilePath(fp)
      if (!approved.has(name)) continue
      const dest = joinSegments(argv.output, name) as FilePath
      await fs.promises.mkdir(path.dirname(dest), { recursive: true })
      await fs.promises.copyFile(joinSegments(argv.directory, fp), dest)
      yield dest
    }
  },
})

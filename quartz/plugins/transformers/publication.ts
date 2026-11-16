import { QuartzTransformerPlugin } from "../types"
import manifest from "../../publication-manifest.json"
import { articleInfo, isArticle, isNote } from "../../util/publication"

export const PublicationMetadata: QuartzTransformerPlugin = () => ({
  name: "PublicationMetadata",
  markdownPlugins() {
    return [() => (_, file) => {
      const fm = file.data.frontmatter!
      if (isArticle(file.data)) {
        const date = (manifest.articleDates as Record<string, string>)[file.data.relativePath!]
        // First recorded repository date is a stable archive date, not today's build date.
        if (!fm.published && date) { fm.published = date; fm.archiveDate = true }
        fm.type ??= "article"
        const info = articleInfo(file.data)
        fm.category ??= info.category
        if (!fm.description && info.description) fm.description = info.description
      } else if (isNote(file.data)) fm.type ??= "knowledge"
    }]
  },
})

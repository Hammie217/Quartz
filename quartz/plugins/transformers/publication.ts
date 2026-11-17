import { QuartzTransformerPlugin } from "../types"
import { contentTypes, strings, text, editorialCategories } from "../../util/publication"

export const PublicationMetadata: QuartzTransformerPlugin = () => ({
  name: "PublicationMetadata",
  markdownPlugins() {
    return [
      () => (_, file) => {
        const fm = file.data.frontmatter!
        const legacy = fm.type as string | undefined
        if (legacy === "knowledge") fm.type = "knowledge-note"
        if (legacy === "event") {
          fm.type = "activity"
          fm.activityType ??= "Speaking"
          fm.role ??= text(fm.participation)
          fm.organisation ??= text(fm.organiser)
          fm.eventDate ??= fm.date
          fm.slidesUrl ??= fm.presentation
          fm.recordingUrl ??= fm.recording
        }
        if (legacy === "graph") {
          fm.type = "page"
          fm.view = "graph"
        }
        fm.type ??= "page"
        if (!contentTypes.includes(fm.type as (typeof contentTypes)[number]))
          throw new Error(`${file.data.relativePath}: unsupported content type ${fm.type}`)
        for (const field of ["related", "topics", "technologies", "recommended"])
          fm[field] = strings(fm[field])
        if (fm.type === "article") {
          const category = text(fm.category).trim() || "Guides"
          const canonical = editorialCategories.find(
            (value) => value.toLowerCase() === category.toLowerCase(),
          )
          if (!canonical)
            throw new Error(
              String(file.data.relativePath) + ": invalid editorial category: " + category,
            )
          fm.category = canonical
        }
        fm.featured = fm.featured === true
        if (fm.featuredOrder == null) delete fm.featuredOrder
        if (fm.featuredOrder !== undefined) {
          const order = Number(fm.featuredOrder)
          if (!Number.isFinite(order))
            throw new Error(`${file.data.relativePath}: featuredOrder must be numeric`)
          fm.featuredOrder = order
        }
        for (const field of ["eventDate", "endDate"]) {
          if (fm[field] && !Number.isFinite(new Date(String(fm[field])).getTime()))
            throw new Error(`${file.data.relativePath}: invalid ${field}`)
        }
      },
    ]
  },
})

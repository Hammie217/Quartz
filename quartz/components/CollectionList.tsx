import { QuartzPluginData } from "../plugins/vfile"
import { QuartzComponentProps } from "./types"
import { ContentCard } from "./ContentCard"
import { strings, text } from "../util/publication"

export default function CollectionList({
  files,
  props,
  id,
  filter = "category",
}: {
  files: QuartzPluginData[]
  props: QuartzComponentProps
  id: string
  filter?: "category" | "topics"
}) {
  const values = (file: QuartzPluginData) =>
    filter === "topics"
      ? strings(file.frontmatter?.topics)
      : [text(file.frontmatter?.category)].filter(Boolean)
  const options = [...new Set(files.flatMap(values))].sort()
  return (
    <div class="content-collection" data-collection={id}>
      {options.length > 1 && (
        <fieldset class="category-filters">
          <legend>Filter by {filter === "topics" ? "topic" : "category"}</legend>
          {["All", ...options].map((option) => (
            <label>
              <input
                type="radio"
                name={`${id}-filter`}
                value={option}
                defaultChecked={option === "All"}
              />
              <span>{option.replaceAll("-", " ")}</span>
            </label>
          ))}
        </fieldset>
      )}
      <p class="filter-count" aria-live="polite">
        {files.length} {files.length === 1 ? "item" : "items"}
      </p>
      <div class="publication-grid three">
        {files.map((file) => (
          <div class="collection-item" data-filter-values={JSON.stringify(values(file))}>
            <ContentCard file={file} props={props} />
          </div>
        ))}
      </div>
      <p class="filter-empty" hidden={files.length > 0}>
        {files.length
          ? "No published content in this selection. Try another category."
          : "There are no published items here yet."}
      </p>
    </div>
  )
}

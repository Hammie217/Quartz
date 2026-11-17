import { QuartzComponentProps } from "./types"
import { relatedContent } from "../util/publication"
import { ContentCard } from "./ContentCard"

export default function RelatedContent(props: QuartzComponentProps) {
  const related = relatedContent(props.fileData, props.allFiles)
  if (!related.length) return null
  return (
    <aside class="related-reading" aria-label="Related content">
      <h2>Related content</h2>
      <div class="publication-grid two">
        {related.map((file) => (
          <ContentCard file={file} props={props} />
        ))}
      </div>
    </aside>
  )
}

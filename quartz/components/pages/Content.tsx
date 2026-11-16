import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import Publication, { RelatedContent, ResourceLinks } from "../Publication"
import { articleInfo, isArticle } from "../../util/publication"
import Graph from "../Graph"
// @ts-ignore
import script from "../scripts/publication.inline"
import { concatenateResources } from "../../util/resources"

const GraphView = Graph({
  localGraph: { depth: -1, scale: 0.9, zoom: true, drag: true, showTags: false },
})

const Content: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, tree } = props
  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  if (fileData.frontmatter?.view)
    return (
      <article class="portfolio-content publication">
        <Publication {...props} body={content} />
      </article>
    )
  const article = isArticle(fileData)
  const caseStudy = fileData.frontmatter?.type === "case-study"
  return (
    <article class={classString}>
      {(article || caseStudy) && (
        <p class="reading-summary">
          {article ? articleInfo(fileData).description : fileData.frontmatter?.description}
        </p>
      )}
      {caseStudy && (
        <dl class="case-metadata">
          {["role", "organisation", "period", "outcome"]
            .filter((key) => fileData.frontmatter?.[key])
            .map((key) => (
              <div>
                <dt>{key}</dt>
                <dd>{String(fileData.frontmatter?.[key])}</dd>
              </div>
            ))}
        </dl>
      )}
      {content}
      {fileData.frontmatter?.type === "graph" && (
        <div class="knowledge-graph">
          <GraphView {...props} />
        </div>
      )}
      {fileData.frontmatter?.type === "event" && <ResourceLinks file={fileData} />}
      {(article || caseStudy) && <RelatedContent {...props} />}
    </article>
  )
}

Content.css = GraphView.css
Content.afterDOMLoaded = concatenateResources(script, GraphView.afterDOMLoaded)
export default (() => Content) satisfies QuartzComponentConstructor

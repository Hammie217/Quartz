import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { ActivityContent, ProjectContent, CaseStudyContent } from "../ProfessionalContent"
import Publication from "../Publication"
import RelatedContent from "../RelatedContent"
import { contentLink } from "../ContentCard"
import { articleInfo, contentType, typeLabels } from "../../util/publication"
import Graph from "../Graph"
import TableOfContents from "../TableOfContents"
// @ts-ignore
import script from "../scripts/publication.inline"
import { concatenateResources } from "../../util/resources"
import style from "../styles/publication.scss"

const GraphView = Graph({
  localGraph: { depth: -1, scale: 0.9, zoom: true, drag: true, showTags: false },
})
const Toc = TableOfContents({ layout: "legacy" })
const Content: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, tree } = props
  const fm = fileData.frontmatter
  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  if (fm?.view && fm.view !== "graph")
    return (
      <article class="portfolio-content publication">
        <Publication {...props} body={content} />
      </article>
    )
  const type = contentType(fileData)
  if (type === "activity") return <ActivityContent {...props} body={content} />
  if (type === "project") return <ProjectContent {...props} body={content} />
  if (type === "case-study") return <CaseStudyContent {...props} body={content} />
  const summary = fm?.description || (type === "article" ? articleInfo(fileData).description : "")
  return (
    <article
      class={["popover-hint", "reading-content", type + "-reading", ...(fm?.cssclasses ?? [])].join(
        " ",
      )}
    >
      {type !== "page" && (
        <p class="reading-kicker">
          {typeLabels[type]}
          {fm?.category && ` / ${fm.category}`}
        </p>
      )}
      {summary && <p class="reading-summary">{summary}</p>}
      {fileData.toc && fileData.toc.length > 0 && (
        <div class="reading-toc">
          <Toc {...props} />
        </div>
      )}
      {content}
      {fm?.view === "graph" && (
        <div class="knowledge-graph">
          <GraphView {...props} />
        </div>
      )}
      {type !== "page" && <RelatedContent {...props} />}
      {type === "article" && (
        <div class="author-bio">
          <strong>Hamish Sams</strong>
          <p>{props.allFiles.find((f) => f.slug === "about/index")?.frontmatter?.description}</p>
          <a href={contentLink(props, "about/index")}>More about Hamish</a>
        </div>
      )}
    </article>
  )
}
Content.css = concatenateResources(GraphView.css, Toc.css, style)
Content.afterDOMLoaded = concatenateResources(script, GraphView.afterDOMLoaded)
export default (() => Content) satisfies QuartzComponentConstructor

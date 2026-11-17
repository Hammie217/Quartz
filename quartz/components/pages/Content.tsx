import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import Publication from "../Publication"
import RelatedContent from "../RelatedContent"
import { assetLink, ResourceLinks, contentLink } from "../ContentCard"
import {
  articleInfo,
  contentDate,
  contentType,
  formatDate,
  strings,
  text,
  typeLabels,
} from "../../util/publication"
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
  const date = contentDate(fileData)
  const thumbnail = assetLink(props, fm?.thumbnail)
  const summary = fm?.description || (type === "article" ? articleInfo(fileData).description : "")
  const metadata =
    type === "case-study"
      ? ["role", "organisation", "period", "outcome"]
      : type === "activity"
        ? ["activityType", "role", "organisation", "location", "status"]
        : []
  return (
    <article class={["popover-hint", "reading-content", ...(fm?.cssclasses ?? [])].join(" ")}>
      {type !== "page" && (
        <p class="reading-kicker">
          {typeLabels[type]}
          {fm?.category && ` / ${fm.category}`}
          {type === "project" && fm?.status && ` / ${fm.status}`}
        </p>
      )}
      {summary && <p class="reading-summary">{summary}</p>}
      {type === "activity" && date && (
        <p>
          <time dateTime={date.toISOString()}>{formatDate(date)}</time>
          {fm?.endDate && ` - ${formatDate(new Date(String(fm.endDate)))}`}
        </p>
      )}
      {metadata.some((field) => fm?.[field]) && (
        <dl class="case-metadata">
          {metadata
            .filter((field) => fm?.[field])
            .map((field) => (
              <div>
                <dt>{field === "activityType" ? "Activity" : field}</dt>
                <dd>{text(fm?.[field])}</dd>
              </div>
            ))}
        </dl>
      )}
      {type === "project" && thumbnail && (
        <img
          class="project-hero-image"
          src={thumbnail}
          alt={text(fm?.thumbnailAlt) || `${fm?.title} preview`}
        />
      )}
      {type === "project" && strings(fm?.technologies).length > 0 && (
        <p class="technologies">
          <strong>Technologies:</strong> {strings(fm?.technologies).join(" · ")}
        </p>
      )}
      {["project", "activity"].includes(type) && <ResourceLinks file={fileData} />}
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

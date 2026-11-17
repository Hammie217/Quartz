import { ComponentChildren } from "preact"
import { QuartzComponentProps } from "./types"
import {
  contentDate,
  contentSection,
  contentType,
  formatDate,
  strings,
  text,
} from "../util/publication"
import { assetLink, contentLink, ResourceLinks } from "./ContentCard"
import RelatedContent from "./RelatedContent"
import TableOfContents from "./TableOfContents"

const Toc = TableOfContents({ layout: "legacy" })
type Props = QuartzComponentProps & { body: ComponentChildren }

function Header(props: Props) {
  const fm = props.fileData.frontmatter!
  const section = contentSection(props.fileData)!
  const date = contentDate(props.fileData)
  return (
    <header class="publication-intro">
      <nav class="publication-breadcrumbs" aria-label="Breadcrumb">
        <a href={contentLink(props, "index")}>Home</a>
        <span>/</span>
        <a href={contentLink(props, section.slug)}>{section.title}</a>
        <span>/</span>
        <span aria-current="page">{fm.title}</span>
      </nav>
      <p class="eyebrow">
        {contentType(props.fileData) === "activity"
          ? text(fm.activityType) || "Professional activity"
          : section.title}
      </p>
      <h1>{fm.title}</h1>
      {date && (
        <p>
          <time dateTime={date.toISOString()}>{formatDate(date)}</time>
          {fm.endDate && " - " + formatDate(new Date(String(fm.endDate)))}
        </p>
      )}
      {fm.description && <p class="lead">{fm.description}</p>}
    </header>
  )
}
function Metadata({ props, fields }: { props: Props; fields: string[] }) {
  const fm = props.fileData.frontmatter!
  const present = fields.filter((field) => text(fm[field]))
  return present.length ? (
    <dl class="case-metadata">
      {present.map((field) => (
        <div>
          <dt>{field}</dt>
          <dd>{text(fm[field])}</dd>
        </div>
      ))}
    </dl>
  ) : null
}
function ReadingBody(props: Props) {
  return (
    <>
      {props.fileData.toc?.length ? (
        <div class="reading-toc">
          <Toc {...props} />
        </div>
      ) : null}
      <div class="publication-body">{props.body}</div>
      <RelatedContent {...props} />
    </>
  )
}

export function ActivityContent(props: Props) {
  return (
    <article class="portfolio-content publication professional-reading activity-content">
      <Header {...props} />
      <Metadata props={props} fields={["organisation", "role", "status", "location"]} />
      <ResourceLinks file={props.fileData} />
      <div class="publication-body">{props.body}</div>
    </article>
  )
}
export function ProjectContent(props: Props) {
  const fm = props.fileData.frontmatter!
  const thumbnail = assetLink(props, fm.thumbnail)
  return (
    <article class="portfolio-content publication professional-reading project-content">
      <Header {...props} />
      <Metadata props={props} fields={["status"]} />
      {thumbnail && (
        <img class="project-hero-image" src={thumbnail} alt={text(fm.thumbnailAlt) || fm.title} />
      )}
      {strings(fm.technologies).length > 0 && (
        <p>
          <strong>Technologies:</strong> {strings(fm.technologies).join(", ")}
        </p>
      )}
      <ResourceLinks file={props.fileData} />
      <ReadingBody {...props} />
    </article>
  )
}
export function CaseStudyContent(props: Props) {
  return (
    <article class="portfolio-content publication professional-reading case-study-content">
      <Header {...props} />
      <Metadata props={props} fields={["organisation", "role", "period", "outcome"]} />
      <ReadingBody {...props} />
    </article>
  )
}

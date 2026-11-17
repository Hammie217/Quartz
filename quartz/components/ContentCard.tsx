import readingTime from "reading-time"
import { QuartzPluginData } from "../plugins/vfile"
import { QuartzComponentProps } from "./types"
import {
  FilePath,
  FullSlug,
  joinSegments,
  pathToRoot,
  resolveRelative,
  slugifyFilePath,
} from "../util/path"
import {
  articleInfo,
  contentDate,
  contentType,
  formatDate,
  text,
  typeLabels,
} from "../util/publication"

export const contentLink = (props: QuartzComponentProps, slug: string) =>
  resolveRelative(props.fileData.slug!, slug as FullSlug)
export function assetLink(props: QuartzComponentProps, value: unknown) {
  const src = text(value)
  if (/^https?:\/\//.test(src)) return src
  if (!src || /^(?:[a-z]+:|\/\/)/i.test(src)) return undefined
  return joinSegments(
    pathToRoot(props.fileData.slug!),
    slugifyFilePath(src.replace(/^\/+/, "") as FilePath),
  )
}
export function ResourceLinks({ file }: { file: QuartzPluginData }) {
  const fm = file.frontmatter
  const resources = Array.isArray(fm?.resources)
    ? (fm.resources as { label: string; url: string }[])
    : []
  const links = [
    ["Source", fm?.repository],
    ["Live demo", fm?.demo],
    ["Event", fm?.eventUrl],
    ["Slides", fm?.slidesUrl],
    ["Recording", fm?.recordingUrl],
    ...resources.map((r) => [r.label, r.url]),
  ].filter(([, url]) => typeof url === "string" && /^https?:\/\//.test(url))
  return links.length ? (
    <div class="resource-links">
      {links.map(([label, url]) => (
        <a href={String(url)}>{String(label)} ↗</a>
      ))}
    </div>
  ) : null
}
export function ContentCard({
  file,
  props,
  featured = false,
}: {
  file: QuartzPluginData
  props: QuartzComponentProps
  featured?: boolean
}) {
  const info = articleInfo(file)
  const type = contentType(file)
  const date = contentDate(file)
  const thumbnail = assetLink(props, file.frontmatter?.thumbnail)
  return (
    <div
      class={`publication-card ${featured ? "featured-article" : ""}`}
      data-content-card
      data-category={info.category}
      data-topics={JSON.stringify(file.frontmatter?.topics ?? [])}
    >
      {thumbnail && (
        <img
          class="card-thumbnail"
          src={thumbnail}
          alt={text(file.frontmatter?.thumbnailAlt) || `${file.frontmatter?.title} preview`}
          loading="lazy"
        />
      )}
      <span class="card-kicker">
        {typeLabels[type]}
        {info.category && ` / ${info.category}`}
      </span>
      <h3>
        <a href={contentLink(props, file.slug!)} data-no-popover>
          {file.frontmatter?.title}
        </a>
      </h3>
      {file.frontmatter?.status && (
        <span class="status-label">{text(file.frontmatter.status)}</span>
      )}
      <p>{info.description}</p>
      {type === "activity" && (
        <p class="activity-context">
          {[file.frontmatter?.role, file.frontmatter?.organisation, file.frontmatter?.location]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
      <span class="article-meta">
        {date && (
          <time dateTime={date.toISOString()}>
            {file.frontmatter?.archiveDate ? "Archive · " : ""}
            {formatDate(date)}
          </time>
        )}
        {type === "article" && (
          <span>{Math.max(1, Math.ceil(readingTime(file.text ?? "").minutes))} min read</span>
        )}
      </span>
      <a class="card-action" href={contentLink(props, file.slug!)} data-no-popover>
        Read {typeLabels[type].toLowerCase()} ↗
      </a>
      <ResourceLinks file={file} />
    </div>
  )
}

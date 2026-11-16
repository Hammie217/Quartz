import { ComponentChildren } from "preact"
import readingTime from "reading-time"
import { QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, resolveRelative } from "../util/path"
import { articleInfo, articles, categories, topics, topicNotes } from "../util/publication"

type Props = QuartzComponentProps & { body?: ComponentChildren }
const link = (p: QuartzComponentProps, slug: string) => resolveRelative(p.fileData.slug!, slug as FullSlug)
const text = (value: unknown) => typeof value === "string" ? value : ""

export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return <div class="section-heading"><h2>{title}</h2>{description && <p>{description}</p>}</div>
}

export function ArticleCard({ file, props, featured = false }: { file: QuartzPluginData; props: QuartzComponentProps; featured?: boolean }) {
  const info = articleInfo(file)
  const date = file.dates?.published
  return <a class={`publication-card article-card${featured ? " featured-article" : ""}`} href={link(props, file.slug!)} data-category={info.category} data-no-popover>
    <span class="card-kicker">{featured ? "Featured perspective / " : ""}{info.category}</span>
    <h3>{file.frontmatter?.title}</h3>
    <p>{info.description}</p>
    <span class="article-meta">{date && <time dateTime={date.toISOString()} title={file.frontmatter?.archiveDate ? "First recorded in the repository" : "Publication date"}>{file.frontmatter?.archiveDate ? "Archive · " : ""}{date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })}</time>}<span>{Math.max(1, Math.ceil(readingTime(file.text ?? "").minutes))} min read</span></span>
    <span class="card-action">Read article <span aria-hidden="true">↗</span></span>
  </a>
}

export function RelatedContent(props: QuartzComponentProps) {
  const current = articleInfo(props.fileData).category
  const related = articles(props.allFiles).filter(f => f.slug !== props.fileData.slug)
    .sort((a, b) => Number(articleInfo(b).category === current) - Number(articleInfo(a).category === current)).slice(0, 2)
  return <aside class="related-reading" aria-label="Related reading"><h2>Continue reading</h2><div class="publication-grid two">{related.map(f => <ArticleCard file={f} props={props} />)}</div>
    <div class="author-bio"><strong>Hamish Sams</strong><p>Manufacturing digitalisation and automation professional working across industrial connectivity, data integration and technology strategy.</p><a href={link(props, "about/index")}>More about Hamish</a></div>
  </aside>
}

function SelectedWork({ props, compact = false }: { props: QuartzComponentProps; compact?: boolean }) {
  const cases = props.allFiles.filter(f => f.frontmatter?.type === "case-study")
  const featured = cases.filter(f => f.frontmatter?.featured === true)
  const selected = compact ? (featured.length ? featured : cases).slice(0, 3) : cases
  const themes = [
    ["Global industrial connectivity", "Integration standards and architecture across manufacturing operations.", "OT integration · Architecture"],
    ["Modernising industrial software", "Exploring more maintainable approaches to deploying industrial applications.", "Containers · Software delivery"],
    ["Manufacturing digitalisation", "Connecting digital technology implementation with operational process improvement.", "Manufacturing · Implementation"],
    ["Building digital delivery capability", "People, portfolio prioritisation and governance alongside technical delivery.", "Leadership · Digital strategy"],
  ]
  return <section class="publication-section" id="selected-work">
    <SectionHeading title="Selected work" description="Examples of the challenges, decisions and initiatives that have shaped my experience in digital manufacturing." />
    {cases.length > 0 ? <div class="publication-grid two">{selected.map(f => <a class="publication-card" href={link(props, f.slug!)}><span class="card-kicker">{text(f.frontmatter?.category)}</span><h3>{f.frontmatter?.title}</h3><p>{f.frontmatter?.description}</p><span class="card-action">Read case study ↗</span></a>)}</div> : <>
      <p class="editorial-note">Case studies are in preparation. These themes describe areas of experience, not published project outcomes.</p>
      <div class={`publication-grid ${compact ? "three" : "two"}`}>{themes.slice(0, compact ? 3 : 4).map(([title, description, tags], index) => <div class="publication-card work-preview"><span class="card-kicker">0{index + 1} / In preparation</span><h3>{title}</h3><p>{description}</p><span class="theme-label">{tags}</span>{compact && <a class="card-action" href={`${link(props, "work/index")}#selected-work`}>Explore experience ↗</a>}</div>)}</div>
    </>}
  </section>
}

function ContactLinks(props: QuartzComponentProps) {
  return <section class="contact-panel"><div><p class="eyebrow">A continuing conversation</p><h2>Good ideas benefit from different perspectives.</h2><p>Explore my background, or get in touch about manufacturing technology and knowledge sharing.</p></div><div class="contact-links"><a href={link(props, "about/index")}>About Hamish ↗</a><a href={link(props, "contact/index")}>Let’s connect ↗</a></div></section>
}

function TopicGrid(props: QuartzComponentProps) {
  return <div class="publication-grid three">{topics.map(topic => <a class="publication-card topic-card" href={link(props, `knowledge/${topic.id}/index`)}><span class="card-kicker">{topicNotes(props.allFiles, topic.id).length} notes</span><h3>{topic.title}</h3><p>{topic.description}</p><span class="card-action">Explore topic ↗</span></a>)}</div>
}

function Insights(props: QuartzComponentProps) {
  const writing = articles(props.allFiles)
  const featured = writing.find(f => articleInfo(f).featured)
  return <>
    {featured && <div class="featured-reading"><ArticleCard file={featured} props={props} featured /></div>}
    <section class="publication-section" aria-labelledby="all-insights"><h2 id="all-insights">All insights</h2>
      <fieldset class="category-filters"><legend>Filter by subject</legend>{["All", ...categories].map(category => <label><input type="radio" name="insight-category" value={category} defaultChecked={category === "All"} /><span>{category}</span></label>)}</fieldset>
      <p class="filter-count" aria-live="polite">{writing.length} articles</p>
      <div class="publication-grid three" id="article-list">{writing.map(f => <ArticleCard file={f} props={props} />)}</div>
      <p class="filter-empty" hidden>No published articles in this category yet. Choose another subject to keep exploring.</p>
    </section>
  </>
}

function Knowledge(props: QuartzComponentProps) {
  return <>
    <form class="knowledge-search" role="search"><label for="knowledge-query">Search the knowledge base</label><div><input id="knowledge-query" type="search" placeholder="Try MQTT, Kubernetes or pharmaceutical engineering" /><button type="submit">Search</button></div><p>Search connected notes, explanations and articles using Quartz.</p></form>
    <section class="publication-section"><SectionHeading title="Find your starting point" description="Browse by subject, follow a reading path, or explore connections between notes." /><TopicGrid {...props} /><p class="browse-all"><a class="text-link" href={link(props, "Notes/index")}>Browse the complete note library ↗</a></p></section>
    <div class="explore-strip"><div><h2>Follow the connections</h2><p>Explore the graph to see how ideas relate across the library.</p></div><a class="text-link" href={link(props, "knowledge/graph/index")}>Explore graph ↗</a></div>
  </>
}

function Topic(props: QuartzComponentProps) {
  const id = text(props.fileData.frontmatter?.topic)
  const topic = topics.find(t => t.id === id)
  if (!topic) return null
  const notes = topicNotes(props.allFiles, id)
  const starting = notes.filter(f => topic.starts.includes(f.slug!.split("/").pop()!)).sort((a, b) => topic.starts.indexOf(a.slug!.split("/").pop()!) - topic.starts.indexOf(b.slug!.split("/").pop()!))
  const recommended = starting.length ? starting : notes.slice(0, 3)
  const related = articles(props.allFiles).filter(f => topic.match.test(f.slug ?? "") || (Array.isArray(f.frontmatter?.topics) && f.frontmatter.topics.includes(id)))
  return <><section class="publication-section"><SectionHeading title="Start here" description="A suggested reading order. Follow the links within each note to go deeper." /><ol class="reading-path">{recommended.map(f => <li><a href={link(props, f.slug!)}>{f.frontmatter?.title}</a></li>)}</ol></section>
    {notes.some(f => f.frontmatter?.featured === true) && <section class="publication-section"><h2>Featured notes</h2><ul>{notes.filter(f => f.frontmatter?.featured === true).map(f => <li><a href={link(props, f.slug!)}>{f.frontmatter?.title}</a></li>)}</ul></section>}
    <section class="publication-section"><h2>All notes <span class="count">{notes.length}</span></h2><ul class="note-directory">{notes.map(f => <li><a href={link(props, f.slug!)}>{f.frontmatter?.title}<span aria-hidden="true">↗</span></a></li>)}</ul></section>
    {related.length > 0 && <section class="publication-section"><h2>Related insights</h2><div class="publication-grid two">{related.slice(0, 4).map(f => <ArticleCard file={f} props={props} />)}</div></section>}
    <p><a class="text-link" href={link(props, "knowledge/index")}>Back to all topics</a></p></>
}

function Events(props: QuartzComponentProps) {
  const events = props.allFiles.filter(f => f.frontmatter?.type === "event").sort((a, b) => String(b.frontmatter?.date).localeCompare(String(a.frontmatter?.date)))
  if (!events.length) return null
  return <section class="publication-section"><h2>Events &amp; resources</h2><div class="publication-grid two">{events.map(f => <div class="publication-card"><span class="card-kicker">{text(f.frontmatter?.status)} / {text(f.frontmatter?.participation)}</span><h3><a href={link(props, f.slug!)}>{f.frontmatter?.title}</a></h3><p>{[f.frontmatter?.organiser, f.frontmatter?.date, f.frontmatter?.location].filter(Boolean).join(" · ")}</p><h4>{text(f.frontmatter?.session)}</h4><p>{text(f.frontmatter?.abstract)}</p><ResourceLinks file={f} /></div>)}</div></section>
}

export function ResourceLinks({ file }: { file: QuartzPluginData }) {
  const fm = file.frontmatter
  const resources = Array.isArray(fm?.resources) ? fm.resources as { label: string; url: string }[] : []
  return <div class="resource-links">{[["Presentation", fm?.presentation], ["Recording", fm?.recording], ...resources.map(r => [r.label, r.url])].filter(([, url]) => typeof url === "string" && /^https?:\/\//.test(url)).map(([label, url]) => <a href={String(url)}>{String(label)} ↗</a>)}</div>
}

export default function Publication(props: Props) {
  const fm = props.fileData.frontmatter!
  const view = text(fm.view)
  const writing = articles(props.allFiles)
  return <>
    <header class={view === "home" ? "editorial-hero" : "publication-intro"}>
      {view !== "home" && <nav class="publication-breadcrumbs" aria-label="Breadcrumb"><a href={link(props, "index")}>Home</a><span aria-hidden="true">/</span>{view === "topic" && <><a href={link(props, "knowledge/index")}>Knowledge</a><span aria-hidden="true">/</span></>}{view === "speaking" && <><a href={link(props, "about/index")}>About</a><span aria-hidden="true">/</span></>}<span>{fm.title}</span></nav>}
      <p class="eyebrow">{text(fm.eyebrow) || fm.title}</p><h1>{text(fm.heading) || fm.title}</h1><p class="lead">{fm.description}</p>
      {view === "home" && <div class="button-row"><a class="button" href={link(props, "work/index")}>Explore my work <span aria-hidden="true">↗</span></a><a class="button button-secondary" href={link(props, "insights/index")}>Read my insights <span aria-hidden="true">↗</span></a></div>}
    </header>
    {view === "home" ? <>
      <div class="credibility-strip"><p><strong>Global perspective</strong>OT integration experience</p><p><strong>6+ years</strong>In pharmaceutical manufacturing</p><p><strong>Engineering to strategy</strong>Delivery, leadership and architecture</p></div>
      <SelectedWork props={props} compact />
      <section class="publication-section"><div class="heading-row"><SectionHeading title="Latest thinking" description="Practical perspectives from the intersection of manufacturing and technology." /><a class="text-link" href={link(props, "insights/index")}>All insights ↗</a></div><div class="latest-grid">{writing.slice(0, 3).map((f, i) => <ArticleCard file={f} props={props} featured={i === 0} />)}</div></section>
      <div class="publication-body">{props.body}</div><ContactLinks {...props} />
    </> : view === "insights" ? <><Insights {...props} />{props.body}</> : view === "knowledge" ? <><Knowledge {...props} />{props.body}</> : view === "topic" ? <><Topic {...props} />{props.body}</> : view === "work" ? <>
      <section class="publication-section"><h2>Experience</h2><ol class="experience-timeline">{(Array.isArray(fm.experience) ? fm.experience as { role: string; period: string; description: string }[] : []).map(item => <li><span class="role-date">GSK / {item.period}</span><div><h3>{item.role}</h3><p>{item.description}</p></div></li>)}</ol></section><SelectedWork props={props} /><div class="publication-body">{props.body}</div><ContactLinks {...props} />
    </> : <><div class="publication-body narrative">{props.body}</div>{view === "speaking" && <Events {...props} />}</>}
  </>
}

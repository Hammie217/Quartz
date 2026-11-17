import { ComponentChildren } from "preact"
import { QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import {
  articles,
  belongsToTopic,
  collection,
  featuredItems,
  text,
  topicDefinitions,
  topicNotes,
} from "../util/publication"
import { ContentCard, contentLink as link } from "./ContentCard"
import ActivityList from "./ActivityList"
import CollectionList from "./CollectionList"

type Props = QuartzComponentProps & { body?: ComponentChildren }
function FeaturedContent({
  props,
  title,
  files,
  target,
}: {
  props: QuartzComponentProps
  title: string
  files: QuartzPluginData[]
  target?: string
}) {
  if (!files.length) return null
  return (
    <section class="publication-section">
      <div class="heading-row">
        <h2>{title}</h2>
        {target && (
          <a class="text-link" href={link(props, target)}>
            View all ↗
          </a>
        )}
      </div>
      <div class="publication-grid three">
        {files.map((file) => (
          <ContentCard file={file} props={props} />
        ))}
      </div>
    </section>
  )
}
function Knowledge(props: QuartzComponentProps) {
  const topics = topicDefinitions(props.allFiles)
  const notes = collection(props.allFiles, "knowledge-note")
  return (
    <>
      <form class="knowledge-search" role="search">
        <label for="knowledge-query">Search the knowledge base</label>
        <div>
          <input
            id="knowledge-query"
            type="search"
            placeholder="Try MQTT, Kubernetes or pharmaceutical engineering"
          />
          <button type="submit">Search</button>
        </div>
        <p>Search connected notes, articles, projects and professional activities.</p>
      </form>
      <section class="publication-section">
        <h2>Find your starting point</h2>
        <div class="publication-grid three">
          {topics.map((topic) => (
            <a
              class="publication-card"
              href={
                topic.slug === "knowledge/index" ? `#topic-${topic.id}` : link(props, topic.slug)
              }
            >
              <span class="card-kicker">{topicNotes(props.allFiles, topic.id).length} notes</span>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <span class="card-action">Explore topic ↗</span>
            </a>
          ))}
        </div>
      </section>
      <FeaturedContent
        props={props}
        title="Beginner notes"
        files={featuredItems(
          notes.filter((f) => f.frontmatter?.beginner === true),
          3,
        )}
      />
      <section class="publication-section">
        <h2>All technical notes</h2>
        <CollectionList files={notes} props={props} id="knowledge" filter="topics" />
      </section>
      {topics
        .filter((t) => t.slug === "knowledge/index")
        .map((topic) => (
          <section class="publication-section" id={`topic-${topic.id}`}>
            <h2>{topic.title}</h2>
            <ul>
              {topicNotes(props.allFiles, topic.id).map((file) => (
                <li>
                  <a href={link(props, file.slug!)}>{file.frontmatter?.title}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      <div class="explore-strip">
        <div>
          <h2>Follow the connections</h2>
          <p>Explore how ideas relate across the library.</p>
        </div>
        <a class="text-link" href={link(props, "knowledge/graph/index")}>
          Explore graph ↗
        </a>
      </div>
    </>
  )
}
function Topic(props: QuartzComponentProps) {
  const id = text(props.fileData.frontmatter?.topic)
  const notes = topicNotes(props.allFiles, id)
  const beginners = notes.filter((f) => f.frontmatter?.beginner === true)
  const relevant = [...articles(props.allFiles), ...collection(props.allFiles, "project")].filter(
    (f) => belongsToTopic(f, id),
  )
  return (
    <>
      <FeaturedContent
        props={props}
        title="Start here"
        files={featuredItems(beginners.length ? beginners : notes, 3)}
      />
      <section class="publication-section">
        <h2>All notes</h2>
        <ul class="note-directory">
          {notes.map((file) => (
            <li>
              <a href={link(props, file.slug!)}>
                {file.frontmatter?.title}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <FeaturedContent
        props={props}
        title="Related articles and projects"
        files={featuredItems(relevant, 4)}
      />
      <p>
        <a class="text-link" href={link(props, "knowledge/index")}>
          All knowledge topics
        </a>
      </p>
    </>
  )
}
function ContactLinks(props: QuartzComponentProps) {
  return (
    <section class="contact-panel">
      <div>
        <h2>Good ideas benefit from different perspectives.</h2>
        <p>
          Explore my background or get in touch about manufacturing technology and knowledge
          sharing.
        </p>
      </div>
      <div class="contact-links">
        <a href={link(props, "about/index")}>About Hamish ↗</a>
        <a href={link(props, "contact/index")}>Let's connect ↗</a>
      </div>
    </section>
  )
}
export default function Publication(props: Props) {
  const fm = props.fileData.frontmatter!
  const view = text(fm.view)
  const writing = articles(props.allFiles)
  const cases = collection(props.allFiles, "case-study")
  const projects = collection(props.allFiles, "project")
  return (
    <>
      <header class={view === "home" ? "editorial-hero" : "publication-intro"}>
        {view !== "home" && (
          <nav class="publication-breadcrumbs" aria-label="Breadcrumb">
            <a href={link(props, "index")}>Home</a>
            <span>/</span>
            {view === "topic" && (
              <>
                <a href={link(props, "knowledge/index")}>Knowledge</a>
                <span>/</span>
              </>
            )}
            {["speaking", "involvement"].includes(view) && (
              <>
                <a href={link(props, "about/index")}>About</a>
                <span>/</span>
              </>
            )}
            <span>{fm.title}</span>
          </nav>
        )}
        <p class="eyebrow">{text(fm.eyebrow) || fm.title}</p>
        <h1>{text(fm.heading) || fm.title}</h1>
        <p class="lead">{fm.description}</p>
        {view === "home" && (
          <div class="button-row">
            <a class="button" href={link(props, "work/index")}>
              Explore my work ↗
            </a>
            <a class="button button-secondary" href={link(props, "insights/index")}>
              Read my insights ↗
            </a>
          </div>
        )}
      </header>
      {view === "home" ? (
        <>
          <div class="credibility-strip">
            <p>
              <strong>Global perspective</strong>OT integration experience
            </p>
            <p>
              <strong>6+ years</strong>In pharmaceutical manufacturing
            </p>
            <p>
              <strong>Engineering to strategy</strong>Delivery, leadership and architecture
            </p>
          </div>
          <FeaturedContent
            props={props}
            title="Selected work"
            files={featuredItems(cases)}
            target="work/index"
          />
          <FeaturedContent
            props={props}
            title="Featured projects"
            files={featuredItems(projects)}
            target="projects/index"
          />
          <FeaturedContent
            props={props}
            title="Latest thinking"
            files={featuredItems(writing)}
            target="insights/index"
          />
          <ActivityList props={props} compact />
          <div class="publication-body">{props.body}</div>
          <ContactLinks {...props} />
        </>
      ) : view === "insights" ? (
        <>
          <FeaturedContent
            props={props}
            title="Featured perspective"
            files={featuredItems(writing, 1)}
          />
          <section class="publication-section">
            <h2>All insights</h2>
            <CollectionList files={writing} props={props} id="insights" filter="topics" />
          </section>
          {props.body}
        </>
      ) : view === "projects" ? (
        <>
          <CollectionList files={projects} props={props} id="projects" />
          {props.body}
        </>
      ) : view === "knowledge" ? (
        <Knowledge {...props} />
      ) : view === "topic" ? (
        <Topic {...props} />
      ) : view === "work" ? (
        <>
          <section class="publication-section">
            <h2>Experience</h2>
            <ol class="experience-timeline">
              {(Array.isArray(fm.experience)
                ? (fm.experience as { role: string; period: string; description: string }[])
                : []
              ).map((item) => (
                <li>
                  <span class="role-date">GSK / {item.period}</span>
                  <div>
                    <h3>{item.role}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <FeaturedContent props={props} title="Case studies" files={cases} />
          <div class="publication-body">{props.body}</div>
          <ContactLinks {...props} />
        </>
      ) : (
        <>
          <div class="publication-body narrative">{props.body}</div>
          {["about", "speaking", "involvement"].includes(view) && (
            <ActivityList props={props} compact={view === "about"} />
          )}
        </>
      )}
    </>
  )
}

import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"
import { concatenateResources } from "../util/resources"
import Search from "./Search"
import Darkmode from "./Darkmode"

const links = [
  ["Work", "work/"],
  ["Projects", "projects/"],
  ["Insights", "insights/"],
  ["Knowledge", "knowledge/"],
  ["About", "about/"],
  ["Contact", "contact/"],
] as const

export default (() => {
  const SearchControl = Search()
  const ThemeControl = Darkmode()

  const PortfolioNav: QuartzComponent = (props) => {
    const slug = props.fileData.slug ?? ("index" as FullSlug)
    const root =
      slug === "404"
        ? new URL(`https://${props.cfg.baseUrl ?? "example.com"}/`).pathname
        : pathToRoot(slug)
    const section = slug === "index" ? "" : slug.split("/")[0]
    const home = `${root.replace(/\/$/, "")}/`
    const activeSection =
      section === "Posts"
        ? "insights"
        : ["Notes", "Recordings", "tags"].includes(section)
          ? "knowledge"
          : section === "experience"
            ? "work"
            : section === "activities"
              ? "about"
              : section

    const navigation = () =>
      links.map(([label, target]) => (
        <a
          href={target ? joinSegments(root, target) : home}
          aria-current={activeSection === target.replace(/\/$/, "") ? "page" : undefined}
          class={label === "Contact" ? "nav-contact" : undefined}
          data-no-popover
        >
          {label}
        </a>
      ))

    return (
      <>
        <a class="skip-link" href="#main-content">
          Skip to content
        </a>
        <div class="portfolio-nav">
          <a class="site-identity" href={home} aria-label="Hamish Sams — home" data-no-popover>
            <span>
              Hamish Sams
              <span class="identity-subtitle">Manufacturing, digital &amp; automation</span>
            </span>
          </a>
          <nav class="desktop-navigation" aria-label="Primary">
            {navigation()}
          </nav>
          <div class="nav-tools">
            <SearchControl {...props} />
            <ThemeControl {...props} />
          </div>
          <details class="mobile-navigation">
            <summary>
              Menu <span aria-hidden="true">＋</span>
            </summary>
            <nav aria-label="Primary mobile">{navigation()}</nav>
          </details>
        </div>
      </>
    )
  }

  PortfolioNav.css = concatenateResources(SearchControl.css, ThemeControl.css)
  PortfolioNav.beforeDOMLoaded = concatenateResources(
    SearchControl.beforeDOMLoaded,
    ThemeControl.beforeDOMLoaded,
  )
  PortfolioNav.afterDOMLoaded = concatenateResources(
    SearchControl.afterDOMLoaded,
    ThemeControl.afterDOMLoaded,
  )
  return PortfolioNav
}) satisfies QuartzComponentConstructor

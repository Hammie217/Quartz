import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { joinSegments, pathToRoot } from "../util/path"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ fileData, cfg }) => {
    const root =
      fileData.slug === "404"
        ? new URL(`https://${cfg.baseUrl ?? "example.com"}/`).pathname
        : pathToRoot(fileData.slug!)
    return (
      <footer class="portfolio-footer">
        <div>
          <a class="footer-name" href={`${root.replace(/\/$/, "")}/`}>
            Hamish Sams<span>.</span>
          </a>
          <p>Engineering, digital manufacturing &amp; industrial technology.</p>
          <small>© {new Date().getFullYear()} Hamish Sams</small>
        </div>
        <nav aria-label="Footer">
          <a href={joinSegments(root, "insights/")}>Insights</a>
          <a href={joinSegments(root, "knowledge/")}>Knowledge</a>
          <a href={joinSegments(root, "contact/")}>Contact</a>
          {Object.entries(opts?.links ?? {}).map(([label, href]) => (
            <a href={href}>
              {label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </footer>
    )
  }
  return Footer
}) satisfies QuartzComponentConstructor<Options>

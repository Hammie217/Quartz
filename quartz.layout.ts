import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      LinkedIn: "https://www.linkedin.com/in/hamish-sams-2ba767153/",
      GitHub: "https://github.com/Hammie217",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Writing",
        limit: 2,
        filter: (f) =>
          f.slug!.startsWith("Posts/") && f.slug! !== "Posts/index" && !f.frontmatter?.noindex,
        linkToMore: "Posts/" as SimpleSlug,
      }),
    ),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Recordings",
        limit: 2,
        filter: (f) =>
          f.slug!.startsWith("Recordings/") && f.slug! !== "Recordings/index" && !f.frontmatter?.noindex,
        linkToMore: "Recordings/" as SimpleSlug,
      }),
    ),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Notes",
        limit: 2,
        filter: (f) => f.slug!.startsWith("Notes/"),
        linkToMore: "Notes/" as SimpleSlug,
      }),
    ),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}

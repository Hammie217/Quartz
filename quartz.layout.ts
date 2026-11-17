import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponent } from "./quartz/components/types"
import { usesKnowledgeLayout } from "./quartz/util/publication"
import ExploreGraph from "./quartz/components/ExploreGraph"

// Professional pages opt into a quiet layout. The knowledge base keeps Quartz navigation.
const technical = (component: QuartzComponent) =>
  Component.ConditionalRender({
    component,
    condition: (page) => usesKnowledgeLayout(page.fileData),
  })

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.PortfolioNav()],
  afterBody: [],
  footer: Component.Footer({
    links: {
      LinkedIn: "https://www.linkedin.com/in/hamish-sams-2ba767153/",
      GitHub: "https://github.com/Hammie217",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    technical(Component.Breadcrumbs()),
    technical(Component.ArticleTitle()),
    technical(Component.ContentMeta()),
    technical(Component.TagList()),
  ],
  left: [technical(Component.Explorer({ title: "Knowledge base" }))],
  right: [technical(ExploreGraph()), technical(Component.Backlinks())],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [technical(Component.Breadcrumbs()), technical(Component.ArticleTitle())],
  left: [technical(Component.Explorer({ title: "Knowledge base" }))],
  right: [],
}

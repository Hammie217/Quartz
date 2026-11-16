import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { resolveRelative, FullSlug } from "../util/path"
import Graph from "./Graph"
import { concatenateResources } from "../util/resources"
import style from "./styles/contextualGraph.scss"

export default (() => {
  const ContextGraph = Graph({ localGraph: { depth: 1 } })
  const ExploreGraph: QuartzComponent = (props) => (
    <div class="contextual-graph">
      <ContextGraph {...props} />
      <a
        class="explore-graph"
        href={resolveRelative(props.fileData.slug!, "knowledge/graph/index" as FullSlug)}
      >
        Explore knowledge graph ↗
      </a>
    </div>
  )
  ExploreGraph.css = concatenateResources(ContextGraph.css, style)
  ExploreGraph.afterDOMLoaded = ContextGraph.afterDOMLoaded
  return ExploreGraph
}) satisfies QuartzComponentConstructor

import { QuartzPluginData } from "../plugins/vfile"

export const categories = ["Strategy", "Industrial Architecture", "Automation", "Leadership", "Guides"]
export const topics = [
  { id: "manufacturing-systems", title: "Manufacturing Systems", description: "MES, SCADA, production systems and operational technology.", match: /MES|SCADA|Ignition|Manufacturing-Execution|Automation|ISA-|PLC|Control-System/i, starts: ["SCADA", "Ignition", "MES"] },
  { id: "industrial-connectivity", title: "Industrial Connectivity", description: "OPC UA, MQTT, brokers, industrial protocols and integration.", match: /MQTT|OPC|Broker|PubSub|AMQP|Kafka|NameSpace|Debezium|API|Application-Programming|Sparkplug/i, starts: ["MQTT", "PubSub", "Message-Broker"] },
  { id: "software-infrastructure", title: "Software & Infrastructure", description: "Containers, Kubernetes, CI/CD and software architecture.", match: /Containerisation\/|CICD|Open-Container|Idempotent|FIFO|LIFO|Proxy/i, starts: ["Container", "Docker", "Kubernetes"] },
  { id: "data-analytics", title: "Data & Analytics", description: "Historians, data models, contextualisation and analytics.", match: /Data|Historian|Analytics|Grafana|Ontology|Kafka|Debezium|NameSpace|Python|SQL/i, starts: ["Unified-NameSpace", "Kafka", "Debezium"] },
  { id: "pharmaceutical-engineering", title: "Pharmaceutical Engineering", description: "Manufacturing processes, equipment and regulated engineering.", match: /^Notes\/Pharma\//, starts: ["Autoclave", "Lyophilisation", "Wet-Bead-Mill"] },
  { id: "strategy-governance", title: "Strategy & Governance", description: "Standards, lifecycle management, governance and digital strategy.", match: /Standard|Governance|NameSpace|\/ISA\d|GMP|Validation|Quality|Regulat|CICD|Qualification|Purdue/i, starts: ["Unified-NameSpace", "ISA88", "Validation"] },
]

// Small overrides keep legacy Markdown untouched. New articles can use frontmatter instead.
const articleOverrides: Record<string, { category: string; description: string; featured?: boolean }> = {
  "Why-your-factory-should-be-deploying-containers": { category: "Industrial Architecture", description: "Why containerisation matters for industrial software, and what it changes about deploying and maintaining manufacturing systems.", featured: true },
  "Kubernetes-Overview": { category: "Guides", description: "A practical introduction to Kubernetes, its core components and how they work together." },
  "Technology-Focus---Fledge-(FogLAMP)": { category: "Industrial Architecture", description: "Exploring an open-source approach to collecting and integrating industrial data at the edge." },
  "How-3D-Printing-is-Transforming-Manufacturing-Sites": { category: "Strategy", description: "Practical applications of additive manufacturing on the factory floor." },
}
export const isArticle = (f: QuartzPluginData) => f.frontmatter?.type === "article" || (f.slug?.startsWith("Posts/") && !f.slug.endsWith("/index"))
export const isNote = (f: QuartzPluginData) => f.frontmatter?.type === "knowledge" || (f.slug?.startsWith("Notes/") && !f.slug.endsWith("/index"))
export function articleInfo(f: QuartzPluginData) {
  const override = articleOverrides[f.slug?.split("/").pop() ?? ""]
  return {
    category: String(f.frontmatter?.category ?? override?.category ?? (/Autoclave|Filling|Bead/.test(f.slug ?? "") ? "Automation" : "Guides")),
    description: f.frontmatter?.description ?? override?.description ?? (f.description ?? "").replace(/\s+/g, " ").slice(0, 180),
    featured: f.frontmatter?.featured === true || (f.frontmatter?.featured !== false && override?.featured === true),
  }
}
export function topicNotes(files: QuartzPluginData[], id: string) {
  const topic = topics.find(t => t.id === id)
  if (!topic) return []
  return files.filter(isNote).filter(f => {
    const assigned = f.frontmatter?.topics
    return Array.isArray(assigned) ? assigned.includes(id) : topic.match.test(f.slug ?? "") || f.frontmatter?.tags?.includes(id)
  }).sort((a, b) => a.frontmatter!.title.localeCompare(b.frontmatter!.title))
}
export function articles(files: QuartzPluginData[]) {
  return files.filter(isArticle).sort((a, b) => Number(articleInfo(b).featured) - Number(articleInfo(a).featured) || (b.dates?.published.getTime() ?? 0) - (a.dates?.published.getTime() ?? 0))
}

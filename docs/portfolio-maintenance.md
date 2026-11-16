# Publishing and maintenance

## Markdown workflow

Use the templates in `content/templates/` for articles, knowledge notes and events. Case-study templates are under `content/work/`. They contain no project outcomes and remain unpublished drafts.

For a new approved document:

1. Create a Markdown file in the appropriate section, outside `templates/` and `Draft/`.
2. Set `title`, `description`, `type`, and an accurate `date` where relevant.
3. Add `category`, `tags`, `topics` and `featured` as appropriate.
4. Review the contents and linked assets for publication approval.
5. Set `publish: true` and `draft: false`, then build and validate locally.

Supported types are `page`, `article`, `case-study`, `knowledge` and `event`. Landing pages additionally use `portfolio: true` and `view` to select their collection layout. Articles and case studies should not use the portfolio layout.

`quartz/util/publication.ts` holds category overrides and topic mappings for legacy notes. New notes can set `topics` explicitly using the topic slugs in `content/knowledge/`. New articles can set `featured: true` and a category: Strategy, Industrial Architecture, Automation, Leadership or Guides.

Legacy article dates use their first recorded Git date and are labelled as archive dates. Set an explicit frontmatter date when the actual publication date is known.

## Events

Set organiser, date, location, participation, status, session, abstract, presentation, recording and resources. Participation can be Speaker, Mentor, Panellist, Organiser or Contributor; status can be Upcoming, Completed or Published. Resources are a list of `{ label, url }` entries. Only approved, explicitly published events appear in the collection. Empty event sections are hidden. Link to externally hosted ISPE materials rather than copying them.

## Publication safety

Keep confidential career notes outside this repository in a separate private folder or repository. Explicitly promote only reviewed content into this public source. Neither `draft` nor the build allowlist protects files committed to a public Git repository.

The `PublicationSafety` filter permits existing technical documents listed in `quartz/publication-manifest.json` and new documents with boolean `publish: true`. `publish: false`, `private: true` and draft flags prevent publication. Review existing technical documents before making sensitive edits; they are already approved by path.

The asset emitter copies only paths in the manifest's `assets` array. Add new public attachments there after review. Never add a private attachment merely to resolve a broken link.

Always build from a clean output directory before deployment; the normal Quartz build does this. Do not upload an old output folder containing files that have since been made private.

## Routes and components

Existing Posts and Notes remain at their original paths. Old about, insights and contact URLs redirect to their section index pages. The experience and employer-project URLs redirect to the public Work overview; the previous local source documents are not promoted for publication. `me` remains an alias to the homepage.

`Publication.tsx` renders collection cards, timelines, topics, related reading and events. `PortfolioNav.tsx` and `Footer.tsx` provide shared navigation. `ExploreGraph.tsx` renders the contextual graph on reading pages; the dedicated graph uses the full graph through the Content template. Styling lives in `quartz/styles/custom.scss` and component stylesheets.

Use Quartz links or its relative-URL helpers, not root-relative links that discard `/Quartz/`.

`docs/content-migration.json` records the original technical source paths, slugs and hashes as a migration snapshot, not a requirement to keep future content unchanged.

## Checks and optional content

Run the build, TypeScript and `scripts/check-portfolio.mjs` checks before deployment. The validation script checks landing pages, internal links at root and `/Quartz/`, historical redirects, contextual graphs and the dedicated full graph.

Still to supply: approved case-study narratives and outcomes, verified event details, optionally a public portrait and contact email. Current contact routes are LinkedIn and GitHub; no email or events are invented.

# Content Guide

Keep one Markdown file per item. Listings, search labels, featured sections and related content come from its metadata, not hand-edited TSX lists.

## Add Content

Copy the matching file from `templates/` into:
- Article: `content/insights/my-article.md`
- Project: `content/projects/my-project.md`
- Case study: `content/work/case-studies/my-case.md`
- Knowledge note: `content/knowledge/my-note.md`
- Activity: `content/activities/my-activity.md`

Use `title`, one of the template's six canonical `type` values, and a short `description`. Set `publish: true` and `draft: false` only when approved. Landing pages use `type: page`. Templates stay outside the publishing directory.

Use ISO dates, quoted as `date: "2026-11-16"`. Articles should have a publication date; undated items sort after dated items. Optional common fields: `lastmod`, `category`, `tags`, `topics`, `related`, `featured`, `featuredOrder`. A note with `beginner: true` is eligible for a topic's starting points.

Projects support `status`, `technologies`, `repository`, `demo`, `thumbnail` and `thumbnailAlt`. Put public images under `content/assets/`; thumbnails use content-root paths such as `assets/project.png`. Only assets referenced by published pages (or legacy-approved assets) are copied. External resources must use HTTP(S).

Activities use `activityType` (e.g. Speaking, Mentoring, Professional Involvement), `role`, `organisation`, `eventDate`, `endDate`, `location`, `status`, `eventUrl`, `slidesUrl`, `recordingUrl`. Supply an event date for scheduled events; use `status: Ongoing` for ongoing involvement. One activity populates Speaking/Involvement and may feature on About/Home. Do not create duplicates.

## Feature And Connect

Set `featured: true`; smaller numeric `featuredOrder` comes first. Ties use newest date then slug. Without featured items, recent content is used, except homepage case studies which must be explicitly featured. Empty homepage collections are hidden.

Use `related: ["projects/my-project", "Notes/Digital/MQTT"]` for explicit relationships. Related content then fills from shared specific topics/tags. Broad topic groups (such as strategy-governance) and editorial categories do not qualify. Activity pages do not show automatic related-reading sections; activity records are never automatically suggested as technical reading. Empty or weak matches are hidden.

Topic pages are ordinary Markdown with `view: topic` and a `topic` matching content metadata. Existing technical folders keep their original URLs; new content does not require a new folder index. Do not move old notes merely to change their category. Add Quartz `aliases` when intentionally changing a URL.

## Privacy

Sensitive employer material must stay outside this repository and `content/`, even while drafting. Draft flags prevent rendering, not disclosure through Git. Non-sensitive drafts may use `draft: true`. Never commit private attachments. Previously committed private files remain in Git history: removing working files does not erase history.

Non-sensitive work in progress belongs in `content/Draft/`, which remains inside the Obsidian vault but is excluded from Quartz builds by `ignorePatterns`. These files are versioned in the public Git repository, so this is not a place for confidential material. Drafts elsewhere must use `draft: true`.

The original personal drafts have been restored unchanged from the separate local `Quartz-private` backup; that backup is retained. Unapproved employer/project material remains outside the repository. The intentional Recordings deletion remains deleted. Templates contain no employer detail.

## Preview And Validate

```sh
node quartz/bootstrap-cli.mjs build
node scripts/check-portfolio.mjs
node --import tsx --test quartz/util/publication.test.ts
# Alternatively use Quartz's development server:
node quartz/bootstrap-cli.mjs build --serve --port 8081
```

Stop any existing server on that port before starting another. A full build clears stale output after removing content or marking it private. Check root and /Quartz/ paths before deployment. No deployment is performed by these commands.

## One File, Automatic Listings

Start with the relevant template, replace its sample copy, then set `draft: false` and `publish: true`. Keep confidential drafts outside the repository.

| Type | Example file | Where it appears |
| --- | --- | --- |
| Case study | `content/work/case-studies/data-integration.md` | Work; Home when `featured: true` |
| Project | `content/projects/connectivity-tool.md` | Projects; eligible for Home |
| Activity | `content/activities/industry-talk.md` | Speaking & Involvement, About/Home selections |
| Article | `content/insights/data-foundations.md` | Insights, eligible for Home and matching topic pages |
| Knowledge note | `content/knowledge/mqtt-sessions.md` | Knowledge directory and matching topic pages |

A case study can set `employmentId: global-ot-integration` to appear beside that role on Work, as well as in the case-study collection. Other current IDs are `digital-data-analytics`, `digitalisation-lead`, and `automation-engineering`. Use an exact `id` from Work's `experience` metadata; leave it empty for independent work. Include only approved challenges, approach, outcomes and lessons.

Project pages have status, technology and resource fields. Activities have their own compact layout with date, organisation, role, status and approved resource links, without the knowledge explorer or graph. Articles retain reading tools and author context; knowledge notes retain their graphs and backlinks.

## Editorial Categories And Descriptions

Articles use one editorial `category`: Strategy, Industrial Architecture, Automation, Leadership or Guides. Missing categories default to Guides; invalid values fail the build instead of creating near-duplicate filters. Add a new editorial category deliberately in `editorialCategories` in `quartz/util/publication.ts` if needed.

Use `topics` for knowledge topic membership and `tags` for specific technical subjects (e.g. mqtt, opc-ua, kubernetes). These do not become Insights filter categories. Filters are derived only from published articles, so empty categories stay hidden.

Write a short frontmatter `description` for every article. This controls collection-card summaries without changing the opening paragraph. All current articles have editable descriptions.

## Curate A Topic

Add an ordered list to the topic page's frontmatter:

```yaml
recommended:
  - Notes/Digital/MQTT
  - Notes/Digital/OPC
  - Posts/Kubernetes-Overview
```

These slugs (or aliases) determine the exact reading order. Duplicates, drafts, missing references and activity records are ignored. Remaining notes appear alphabetically, without repeating recommended notes. Without a list, beginner notes are preferred, followed by alphabetical fallback. Topic membership itself stays automatic.

## Build Consistency

Every generated page carries `quartz-build` metadata. `public/build-info.json` records the same build ID and, in CI, its commit. CSS, JavaScript and search-index URLs include that ID. SPA navigation revalidates HTML and reloads when crossing builds rather than retaining old scripts.

Run `node scripts/check-build-consistency.mjs` after building. The deployment workflow now runs this and the route/link tests before uploading its freshly built artifact. GitHub Pages still controls HTTP caching; already-open tabs from before this change need one full reload. Changes on review branches are not deployed.

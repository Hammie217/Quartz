# Structural Refinement Review

Review branch: `codex/structural-refinements`. No push or deployment performed.

## Live Deployment Audit

Inspected the live site and public GitHub Actions status on 17 November 2026.

- The latest production workflow succeeded for commit `22c43f1ad0e9b1bcb91842413c15054741273f06`: [deployment run](https://github.com/Hammie217/Quartz/actions/runs/43990811771).
- Home, Work, Projects, Insights, Knowledge, About, Speaking, the ISPE activity and MQTT note all returned the current Projects navigation.
- Explicit index.html variants also returned current navigation. The historical about.html URL remains a small redirect, not an older page template.
- Sampled pages, shared CSS/JS and search index all reported Last-Modified 17 November 2026 00:51:19 GMT and Cache-Control max-age=600.
- The domain root is a separate, older redirect to /Quartz/, not another copy of the portfolio.
- No mixed server-side layout was reproduced in these requests. Previously open tabs/browser caches remain a plausible explanation, not a proven cause. The existing implementation had unversioned shared assets and retained JavaScript/search data during SPA navigation.
- No service worker registration was found in the site's source. Cache headers are controlled by GitHub Pages; this repository cannot force their expiry.

## Consistency Safeguards

Every generated page, including redirects and 404, now has a quartz-build meta value. build-info.json records the matching ID and CI commit. CSS, pre/post scripts and the search index use versioned URLs. Navigation revalidates HTML and falls back to a full navigation on build-ID changes instead of mixing old scripts with new pages.

Build output is removed completely before generation. CI validates every generated HTML file for build identity, navigation and resource versions, then runs root/subpath route checks before artifact upload. These safeguards apply after review and deployment; an already-open pre-change tab needs one full reload. Query-versioning does not make GitHub Pages' old HTML immutable or bypass all CDN caching.

## Content Refinements

- ActivityContent is a compact professional record: title/type, available dates, description, organisation, role, status, location and approved resources. No knowledge sidebar, graph, TOC or technical recommendations.
- ProjectContent and CaseStudyContent share a quiet professional shell with type-appropriate metadata and reading tools. Articles retain summaries, category/date/reading tools and author context. Knowledge notes retain the explorer, mini graph and backlinks. The full graph is unchanged.
- Breadcrumbs and active navigation derive from content type, not just source directory, preserving legacy URLs.
- Insights filters use the editorial category vocabulary: Strategy, Industrial Architecture, Automation, Leadership, Guides. Only categories present in published articles appear. Technical topics/tags stay separate. Missing descriptions were added as editable frontmatter summaries without changing article bodies.
- Published case studies populate Work automatically. An optional employmentId associates a case with an experience entry's id. Homepage case studies require featured: true; empty case-study collections stay hidden.
- Topic recommended lists allow explicit order by slug/alias. Remaining notes sort alphabetically without duplication; absent lists prefer beginner notes. Industrial Connectivity demonstrates the configuration using existing notes.
- Related content uses explicit references first, then specific tags/topics. Broad topic groups and editorial categories no longer create recommendations. Activity records never enter automatic technical recommendations.
- Projects retains primary navigation and a plain, honest empty state without fictitious content.
- CONTENT_GUIDE.md covers all five authoring paths, public promotion, employment associations, editorial categories, curation, privacy and build validation.

## Validation

Local TypeScript and 57 utility tests pass. The source migration audit preserves all 220 retained bodies and URLs, with drafts excluded. The route suite covers 16 professional pages and 2,238 URLs across root and /Quartz/ hosting. The build consistency suite covers all 258 HTML outputs.

Isolated fixtures exercise new project/article/case-study/note/activity listings, role associations, featured cases, professional templates, category filters, related reading, resources, draft exclusion and asset safety without adding sample records to the real site.

Browser checks cover the activity layout, no graph/recommendations, Insights filtering, Projects empty state, curated reading order, both graph views, and 390-pixel activity/Insights layouts. A tab on the previous local build navigated to the rebuilt site and acquired the new build ID and script URLs. Final build, route checks and source-body audit all passed. CI itself was not run remotely because deployment is deliberately withheld.

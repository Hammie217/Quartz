# Content Refactor Report

Branch: `codex/content-architecture-refactor`. Local-only work; no commit, push or deployment.

## Structure

Six canonical types: page, article, project, case-study, knowledge-note, activity. Shared cards, collections, relationship selection and activity groups replace hand-maintained article/event lists. Projects is a real destination in the primary navigation. Search results identify content type.

Reading pages retain technical navigation, backlinks and actual mini graphs. The dedicated full graph remains available. Pages with sufficient headings have a native collapsible table of contents. Project/activity resources and related content share reusable components.

## Preservation And Consolidation

The migration ledger `docs/refactor-migration.json` records all 220 retained technical documents, old/new URLs and original Markdown-body hashes. Their paths and bodies are unchanged; only metadata was migrated. Posts and Notes deliberately remain in place to avoid breaking inbound URLs and wikilinks. New writing uses the flat type-specific locations in the Content Guide.

The homepage is now `content/index.md` instead of `content/_index.md`, with the same URL. Projects no longer redirects to Work. Historical employer-project URLs still redirect to the public Work overview.

The user-confirmed deletion of `content/Recordings/Recordings.md` is preserved. Excluded drafts, local duplicate pages and unapproved project material were backed up outside the repository at `/Users/hammie217/Desktop/Quartz-private/content-refactor-TNjwLj`. Starter templates now live in root `templates/`, outside the build input. Previously tracked private files remain in Git history; no history rewrite was attempted.

No invented projects, results or speaking events were added. Empty homepage collections are hidden. Projects honestly has no published entries until an approved project is added. ISPE participation uses one canonical activity based on existing public copy.

## Checks

- TypeScript: passes.
- Utility suite: 53 tests pass, including five new publication tests.
- Normal Quartz build: 237 Markdown inputs, 551 emitted files.
- Migration audit: all 220 original bodies, URLs and search entries verified; all 46 legacy assets retained.
- Portfolio validation: 15 pages and 2,230 internal URL checks across root and /Quartz/ deployment paths; historical redirects and both graph configurations retained.
- Isolated fixture build: new article, project, case study, note and activity appear automatically; explicit draft and draft-only image excluded; published thumbnail copied; wikilink, TOC, related content and typed search checked.
- Browser: search labels, topic filter visibility, contextual/full graph rendering, native TOC collapse, light/dark themes, /Quartz/ route, 390-pixel homepage/reading layouts and mobile menu checked. No captured browser console errors.
- Live preview rebuild: marking a published project as draft removes its HTML, search entry and collection cards; adding a new project updates Home and Projects without index edits.
- Generated caches are excluded from source whitespace/style checks. Existing Markdown bodies were intentionally not reformatted.

Preview rebuilds now rerun publication filters and regenerate dependent pages from a clean output. This trades some rebuild speed for correct collections and removal of stale private pages/assets. A fresh build remains mandatory before deployment.

## Workflow And Limits

See `CONTENT_GUIDE.md` for templates, publishing, featuring and related links. No new dependencies or CMS were introduced. GitHub Pages configuration still deploys only the v4 branch. CI on Node 22 was inspected but not executed remotely; local checks used installed Node 20.

The existing local server at http://localhost:8081 serves the rebuilt public output. No new hosted preview or production deployment was created.

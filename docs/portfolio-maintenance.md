# Publishing And Maintenance

The current authoring workflow is in [CONTENT_GUIDE.md](../CONTENT_GUIDE.md). Templates live in the repository's `templates/` directory, outside the publishing source.

## Architecture

- `quartz/util/publication.ts`: content types, ordering, topic membership, related-content selection and activity grouping.
- `ContentCard`, `CollectionList`, `ActivityList`, `RelatedContent`: reusable presentation.
- `Publication.tsx`: landing-page composition, with collections derived from metadata.
- `pages/Content.tsx`: reading layout, collapsible TOC, resource links and related content.
- `ExploreGraph.tsx`: actual contextual graph; the dedicated graph retains its full network.
- `PublicationSafety`: explicit promotion of new content; legacy routes remain allowlisted.
- `Assets`: legacy-approved assets plus referenced public assets under `content/assets/`.

## Compatibility

Posts and Notes retain their original paths and bodies. Frontmatter supplies their canonical type and topic instead of runtime filename heuristics. Old about, contact, insights, experience and employer-project redirects remain. Projects now has a real listing, not a redirect to Work.

Historical dates inferred from Git remain labelled as archive dates. Replace them with verified publication dates when known.

See [refactor migration ledger](refactor-migration.json) for the 220 retained document routes and baseline body hashes. Hashes record this migration, not a prohibition against future writing.

## Validation

Run a full Quartz build, TypeScript, `scripts/check-portfolio.mjs`, `scripts/check-content-migration.mjs`, and the publication utility tests. `scripts/check-content-fixtures.mjs` copies content to a temporary directory, tests all five publishing types plus a draft, and never adds fixtures to the real site.

Normal builds clear stale output. Always perform a fresh build before deploying; never upload old output after making a document private. Confidential source must remain outside the repository. Removing previously tracked files does not remove their Git history.

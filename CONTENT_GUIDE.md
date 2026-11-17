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

Set `featured: true`; smaller numeric `featuredOrder` comes first. Ties use newest date then slug. Without featured items, recent content is used. Empty homepage collections are hidden.

Use `related: ["projects/my-project", "Notes/Digital/MQTT"]` for explicit relationships. Related content then fills from shared specific topics/tags, then category. It never fills with arbitrary unrelated pages.

Topic pages are ordinary Markdown with `view: topic` and a `topic` matching content metadata. Existing technical folders keep their original URLs; new content does not require a new folder index. Do not move old notes merely to change their category. Add Quartz `aliases` when intentionally changing a URL.

## Privacy

Sensitive employer material must stay outside this repository and `content/`, even while drafting. Draft flags prevent rendering, not disclosure through Git. Non-sensitive drafts may use `draft: true`. Never commit private attachments. Previously committed private files remain in Git history: removing working files does not erase history.

The refactor preserved excluded sources in a separate local `Quartz-private` backup. The intentional Recordings deletion remains deleted. Templates contain no employer detail.

## Preview And Validate

```sh
node quartz/bootstrap-cli.mjs build
node scripts/check-portfolio.mjs
node --import tsx --test quartz/util/publication.test.ts
# Alternatively use Quartz's development server:
node quartz/bootstrap-cli.mjs build --serve --port 8081
```

Stop any existing server on that port before starting another. A full build clears stale output after removing content or marking it private. Check root and /Quartz/ paths before deployment. No deployment is performed by these commands.

# Hamish Sams: manufacturing, digital and automation

Professional portfolio and connected technical knowledge base, built with Quartz 4.5.0.

[Website](https://hammie217.github.io/Quartz/) | [LinkedIn](https://www.linkedin.com/in/hamish-sams-2ba767153/) | [GitHub](https://github.com/Hammie217)

## Structure

- `content/index.md`: homepage.
- `content/work/`: career overview and approved case studies.
- `content/insights/`: article collection, including the existing `Posts/` archive.
- `content/knowledge/`: topic guides and full interactive graph.
- `content/about/`: biography and industry participation.
- `content/contact/`: professional contact links.
- `content/Posts/`, `content/Notes/`, `content/Recordings/`: retained content and URLs.

Reading pages retain search, backlinks, contextual graphs, highlighting and tables of contents. The header provides search and theme controls throughout the site. Professional landing pages use a separate editorial layout.

## Local development

Use Node.js 22 and npm 9.3.1 or newer, matching the deployment workflow.

```sh
npm ci
node quartz/bootstrap-cli.mjs build --serve --port 8081
```

Open http://localhost:8081/. For build and validation:

```sh
node quartz/bootstrap-cli.mjs build
npx tsc --noEmit
node scripts/check-portfolio.mjs
```

The first build downloads fonts for OpenGraph images. Subsequent builds reuse the font cache.

## Publishing

The existing GitHub Actions workflow builds and deploys on pushes to `v4`. Only `public/` is uploaded to Pages. The production base URL is `hammie217.github.io/Quartz`.

New documents require `publish: true`; `draft: true` prevents publication. Existing technical documents are listed in `quartz/publication-manifest.json`. New public assets belong under content/assets and are copied when referenced by published content. See [Content Guide](CONTENT_GUIDE.md) for the current publishing workflow.

Do not store confidential information in this repository, even in ignored-by-Quartz documents. A build filter does not make a public Git repository private. Avoid `quartz sync` when you only intend to preview; it can commit and push unrelated local files.

Powered by [Quartz](https://quartz.jzhao.xyz/), under its original [MIT licence](LICENSE.txt).

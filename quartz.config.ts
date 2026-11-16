import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { PublicationSafety } from "./quartz/plugins/filters/publication"
import { PublicationMetadata } from "./quartz/plugins/transformers/publication"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Hamish Sams",
    pageTitleSuffix: " | Hamish Sams",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-GB",
    baseUrl: "hammie217.github.io/Quartz",
    ignorePatterns: ["private", "templates", ".obsidian", "Draft", "**/.DS_Store"],
    defaultDateType: "published",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#F8F9F7",
          lightgray: "#E2E7E5",
          gray: "#667580",
          darkgray: "#172B3A",
          dark: "#172B3A",
          secondary: "#147C78",
          tertiary: "#168B86",
          highlight: "rgba(25, 106, 102, 0.08)",
          textHighlight: "#c8dfcb88",
        },
        darkMode: {
          light: "#111A22",
          lightgray: "#32434C",
          gray: "#A7B5BD",
          darkgray: "#F1F5F4",
          dark: "#F1F5F4",
          secondary: "#51BDB3",
          tertiary: "#51BDB3",
          highlight: "rgba(137, 204, 196, 0.12)",
          textHighlight: "#35786f88",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      PublicationMetadata(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.CenterImages(),
    ],
    filters: [Plugin.RemoveDrafts(), PublicationSafety()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config

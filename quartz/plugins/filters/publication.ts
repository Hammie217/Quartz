import path from "node:path"
import manifest from "../../publication-manifest.json"
import { QuartzFilterPlugin } from "../types"

// Existing technical content is grandfathered; new documents require explicit promotion.
export const PublicationSafety: QuartzFilterPlugin = () => ({
  name: "PublicationSafety",
  shouldPublish(ctx, [, file]) {
    const relative = path
      .relative(ctx.argv.directory, file.data.filePath!)
      .split(path.sep)
      .join("/")
    const fm = file.data.frontmatter
    if (
      fm?.private === true ||
      fm?.private === "true" ||
      fm?.publish === false ||
      fm?.publish === "false"
    )
      return false
    return fm?.publish === true || manifest.legacy.includes(relative)
  },
})

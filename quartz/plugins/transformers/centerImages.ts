import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Element } from "hast"

export const CenterImages: QuartzTransformerPlugin = () => {
  return {
    name: "CenterImages",
    markdownPlugins() {
      return []
    },
    htmlPlugins() {
      return [
        [
          (tree) => {
            visit(tree, "element", (node: Element) => {
              // Ensure the node is valid and has the expected structure
              if (node && node.tagName === "img") {
                // Ensure the className property is an array
                if (!Array.isArray(node.properties.className)) {
                  node.properties.className = []
                }

                // Add the "centered-image" class to the array of class names
                node.properties.className.push("centered-image")
              }
            })
          },
        ],
      ]
    },
    externalResources() {
      return {
        css: [
          {
            // Custom CSS to center images
            content: `
              .centered-image {
                display: block;
                margin-left: auto;
                margin-right: auto;
              }
            `,
          },
        ],
      }
    },
  }
}

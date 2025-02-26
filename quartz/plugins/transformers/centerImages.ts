import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Root as HTMLRoot, Element } from "hast"

export const CenterImages: QuartzTransformerPlugin = () => {
  return {
    name: "CenterImages",
    markdownPlugins() {
      return []  // No markdown transformation needed
    },
    htmlPlugins() {
      return [
        () => {
          return (tree: HTMLRoot, file) => {
            // Traverse the HTML tree and directly modify image tags
            visit(tree, "element", (node: Element) => {
              if (node.tagName === "img") {
                if (!node.properties) node.properties = {};

                // Add inline styles to center the image and limit its width
                node.properties.style = node.properties.style || "";  // Ensure style exists
                node.properties.style += "display: block; margin-left: auto; margin-right: auto; height: auto;";

              }
            });

            return tree;
          }
        },
      ]
    }
  }
}

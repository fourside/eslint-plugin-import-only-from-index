import { Rule } from "eslint";
import { Node, ImportDeclaration } from "estree";
import path from "path";
import fs from "fs";

export const importOnlyFromIndex: Rule.RuleModule = {
  meta: {
    type: "problem",
    schema: [
      {
        type: "array",
        items: { type: "string" },
      },
    ],
  },
  create: function (context: Rule.RuleContext): Rule.RuleListener {
    const fileName = context.getFilename();
    const option = context.options[0][0];
    const targetPath = path.resolve(option);

    return {
      ImportDeclaration: async (node: Node) => {
        const { source } = node as ImportDeclaration;
        if (source.value === undefined || source.value === null) {
          return;
        }
        const sourceValue = source.value.toString();
        if (!sourceValue.startsWith(".") || !sourceValue.startsWith("..")) {
          return;
        }
        const resolvedSourcePath = path.resolve(path.dirname(fileName), sourceValue);
        if (!resolvedSourcePath.startsWith(targetPath)) {
          return;
        }
        HIDDEN_EXTENSIONS.forEach((ext) => {
          const fileNameWithExt = `${resolvedSourcePath}${ext}`;
          if (fs.existsSync(fileNameWithExt)) {
            context.report({
              node,
              message: `cannot import except index under '${option}'`,
            });
          }
        });
      },
    };
  },
};

const HIDDEN_EXTENSIONS = [".ts", ".tsx", ".css"];

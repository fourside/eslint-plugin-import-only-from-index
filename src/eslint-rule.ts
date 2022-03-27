import { Rule } from "eslint";
import type { Node, ImportDeclaration } from "estree";
import fs from "fs";
import path from "path";
import { isRestrictedSource } from "./is-restricted-source";

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
    const editingFileName = context.getFilename();
    const option = context.options[0][0];
    const restrictedPath = path.resolve(option);

    return {
      ImportDeclaration: async (node: Node) => {
        const { source } = node as ImportDeclaration;
        const sourceValue = source.value?.toString();
        if (sourceValue === undefined) {
          return;
        }
        const sourceFileName = sourceValue.startsWith(".")
          ? path.resolve(path.dirname(editingFileName), sourceValue)
          : sourceValue;

        for (const ext of HIDDEN_EXTENSIONS) {
          const sourceFileWithExtension = `${sourceFileName}${ext}`;
          if (fs.existsSync(sourceFileWithExtension)) {
            if (isRestrictedSource(editingFileName, sourceFileWithExtension, restrictedPath)) {
              context.report({
                node,
                message: `cannot import except index under '${option}'`,
              });
            }
          }
        }
      },
    };
  },
};

const HIDDEN_EXTENSIONS = [".ts", ".tsx", ".css"];

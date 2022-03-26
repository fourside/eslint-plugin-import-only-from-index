import { Rule } from "eslint";
import { Node, ImportDeclaration } from "estree";
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
        if (source.value === undefined || source.value === null) {
          return;
        }
        if (isRestrictedSource(editingFileName, source.value.toString(), restrictedPath)) {
          context.report({
            node,
            message: `cannot import except index under '${option}'`,
          });
        }
      },
    };
  },
};

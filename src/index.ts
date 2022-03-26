import { importOnlyFromIndex } from "./eslint-rule";
import init from "./ts-plugin";

export = Object.assign(init, {
  rules: {
    "import-only-from-index": importOnlyFromIndex,
  },
});

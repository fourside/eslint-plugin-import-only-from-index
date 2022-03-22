import { test, describe, beforeAll, afterAll } from "vitest";
import { RuleTester } from "eslint";
import fs from "fs";
import path from "path";
import { importOnlyFromIndex } from "./import-only-from-index";

const tester = new RuleTester({
  parserOptions: { ecmaVersion: 2019, sourceType: "module" },
});

describe("import-only-from-index", () => {
  beforeAll(() => {
    fs.mkdirSync("fixtures/components/button", { recursive: true });
    fs.writeFileSync("fixtures/components/button/index.ts", "");
    fs.writeFileSync("fixtures/components/button/button.tsx", "");
    fs.writeFileSync("fixtures/components/button/button.css.ts", "");
    fs.mkdirSync("fixtures/lib", { recursive: true });
    fs.writeFileSync("fixtures/lib/client.ts", "");
    fs.writeFileSync("fixtures/lib/hoge.ts", "");
  });

  afterAll(() => {
    fs.rmdirSync("fixtures", { recursive: true });
  });

  test("import-only-from-index", () => {
    tester.run("import-only-from-index", importOnlyFromIndex, {
      valid: [
        {
          name: "import先が設定ディレクトリ配下ではない",
          options: [["fixtures/components"]],
          filename: path.join(__dirname, "../fixtures/lib/client.ts"),
          code: `import { hoge } from "./hoge";`,
        },
        {
          name: "設定ディレクトリ配下のimport先がindex.ts",
          options: [["fixtures/components"]],
          filename: path.join(__dirname, "../fixtures/lib/client.ts"),
          code: `import { Button } from "../../components/button";`,
        },
        {
          name: "設定ディレクトリ配下のimport先がindex.ts以外だが、兄弟ディレクトリ",
          options: [["fixtures/components"]],
          filename: path.join(__dirname, "../fixtures/components/button/button.tsx"),
          code: `import { primary } from "./button.css";`,
        },
      ],
      invalid: [
        {
          name: "設定ディレクトリ配下のimport先がindexではない",
          options: [["fixtures/components"]],
          filename: path.join(__dirname, "../fixtures/lib/client.ts"),
          code: `import { primary } from "../components/button/button.css";`,
          errors: [
            {
              message: "cannot import except index under 'fixtures/components'",
            },
          ],
        },
      ],
    });
  });
});

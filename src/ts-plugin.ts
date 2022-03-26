import path from "path";
import { isRestrictedSource } from "./is-restricted-source";

function init(modules: { typescript: typeof import("typescript/lib/tsserverlibrary") }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ts = modules.typescript;

  function create(info: ts.server.PluginCreateInfo) {
    // const log = (message: unknown) => {
    //   info.project.projectService.logger.info(String(message));
    // };
    const restrictedPath: string = info.config.restrictedPath;
    if (restrictedPath === undefined) {
      return info.languageService;
    }

    // Set up decorator object
    const proxy: ts.LanguageService = Object.create(null);
    for (const key of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
      const ls = info.languageService[key];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      proxy[key] = ls as any;
    }

    proxy.getCompletionsAtPosition = (fileName, position, options) => {
      const prior = info.languageService.getCompletionsAtPosition(fileName, position, options);
      if (prior === undefined) {
        return prior;
      }
      const program = info.languageService.getProgram();
      if (program === undefined) {
        return prior;
      }
      const resolvedRestrictedPath = path.resolve(program.getCurrentDirectory(), restrictedPath);
      const filtered = prior.entries.filter((entry) => {
        if (entry.kindModifiers !== "export" || entry.data === undefined) {
          return true;
        }
        const { fileName: entryFilename } = entry.data;
        if (entryFilename === undefined) {
          return true;
        }
        if (isRestrictedSource(fileName, entryFilename, resolvedRestrictedPath)) {
          return false;
        }
        return true;
      });
      prior.entries = filtered;
      return prior;
    };

    return proxy;
  }

  return { create };
}

export = init;

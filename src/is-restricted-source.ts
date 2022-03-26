import path from "path";

export function isRestrictedSource(editingFileName: string, sourceFileName: string, restrictedPath: string): boolean {
  const sourceDir = path.dirname(sourceFileName);
  if (path.dirname(editingFileName) === sourceDir) {
    return false;
  }
  return sourceDir.startsWith(restrictedPath);
}

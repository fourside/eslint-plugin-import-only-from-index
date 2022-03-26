import path from "path";
import fs from "fs";

const HIDDEN_EXTENSIONS = [".ts", ".tsx", ".css"];

export function isRestrictedSource(editingFileName: string, sourceFileName: string, restrictedPath: string): boolean {
  if (!sourceFileName.startsWith(".") || !sourceFileName.startsWith("..")) {
    return false;
  }
  const resolvedSourcePath = path.resolve(path.dirname(editingFileName), sourceFileName);
  if (!resolvedSourcePath.startsWith(restrictedPath)) {
    return false;
  }
  for (const ext of HIDDEN_EXTENSIONS) {
    const fileNameWithExt = `${resolvedSourcePath}${ext}`;
    if (fs.existsSync(fileNameWithExt)) {
      return true;
    }
  }
  return false;
}

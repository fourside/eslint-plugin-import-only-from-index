import { test, expect } from "vitest";
import { isRestrictedSource } from "./is-restricted-source";

test("editingFileNameとsourceFileNameが同じディレクトリならfalse", () => {
  // arrange
  const editingFileName = "/foo/bar/baz.ts";
  const sourceFileName = "/foo/bar/qux.ts";
  // act
  const result = isRestrictedSource(editingFileName, sourceFileName, "/foo/bar");
  // assert
  expect(result).toBe(false);
});

test("editingFileNameとsourceFileNameが違うディレクトリならtrue", () => {
  // arrange
  const editingFileName = "/foo/bar/baz.ts";
  const sourceFileName = "/foo/bar/qux/quux.ts";
  // act
  const result = isRestrictedSource(editingFileName, sourceFileName, "/foo/bar");
  // assert
  expect(result).toBe(true);
});

test("editingFileNameとsourceFileNameが違い、かつsourceFileNameがrestrictedPath配下ならtrue", () => {
  // arrange
  const editingFileName = "/foo/bar/baz.ts";
  const sourceFileName = "/foo/bar/qux/quux.ts";
  const restrictedPath = "/foo/bar";
  // act
  const result = isRestrictedSource(editingFileName, sourceFileName, restrictedPath);
  // assert
  expect(result).toBe(true);
});

test("editingFileNameとsourceFileNameが違い、かつsourceFileNameがrestrictedPathに含まれなければfalse", () => {
  // arrange
  const editingFileName = "/foo/bar/baz.ts";
  const sourceFileName = "/foo/bar/qux/quux.ts";
  const restrictedPath = "/bar";
  // act
  const result = isRestrictedSource(editingFileName, sourceFileName, restrictedPath);
  // assert
  expect(result).toBe(false);
});

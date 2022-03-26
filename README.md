# eslint-plugin-import-only-from-index

## Installation

`npm install -D eslint-plugin-import-from-index`

## Example

.eslintrc
```
"plugin": ["import-only-from-index"],
"rules": {
  "import-only-from-index/import-only-from-index": ["error", ["src/components"]
}
```

tsconfig.json
```
"compilerOptions": {
  "plugins": [
    {
      "name": "eslint-plugin-import-only-from-index",
      "restrictedPath": "src/components"
    }
  ]
}
```

## License

MIT

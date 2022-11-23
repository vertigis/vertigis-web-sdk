This folder may seem bizarre but is necessary since existing SDK projects have
their own eslint config that extends
`require.resolve("@vertigis/web-sdk/config/.eslintrc")`. This will only work if
`config/.eslintrc` is a Common JS module, but this project was converted to
`"type": "module"`. It appears that Node will NOT resolve a module with a .cjs
extension unless the extension is explicitly included in the path, which it
isn't in this case.

By creating a folder with the same name containing a Common JS index.js and a
package.json with `"type": "commonjs"`, it allows us to have this path still
work via `require()` even after converting the SDK to ESM.

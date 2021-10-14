/** Build distibution files with ESBuild for standalone deployment.
 *
 *  While this is obnoxious, integrations edge cases are a worse pain.
 */

const license =
`/**
 * @name     lite-search
 * @desc     A standalone instant search component.
 * @author   Daniel Souza <me@posix.dev.br>
 * @version  ${process.env.npm_package_version}
 * @license  MIT
 */`

// Development
require('esbuild').buildSync({
  entryPoints: ['index.js'],
  outfile: 'dist/search.js',
  sourcemap: true,
  bundle: true,
  logLevel: 'info',
  banner: { js: license }
})

// Production
require('esbuild').buildSync({
  entryPoints: ['index.js'],
  outfile: 'dist/search.min.js',
  bundle: true,
  minify: true,
  logLevel: 'info'
})

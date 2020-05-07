const path = require('path')
const Plugin = require('../../index')
const fs = require('fs-extra')
const resolve = (src) => path.resolve(__dirname, src)
const dist = resolve('./dist')

fs.removeSync(dist)

module.exports = {
  context: __dirname,
  entry: {
    app: './example.js'
  },
  output: {
    libraryTarget: 'umd',
    path: dist,
    filename: 'bundle.js'
  },
  plugins: [
    new Plugin([
      {
        targetChunk: 'app',
        rules: [
          {
            regex: /inject-tag-lib/,
            injectChunk: 'lib'
          }
        ]
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxSize: 0,
      minChunks: 1,
      name: false,
      cacheGroups: {
        lib: {
          name: 'lib',
          test: /lib/,
          filename: 'lib.[hash:8].js'
        }
      }
    }
  }
}

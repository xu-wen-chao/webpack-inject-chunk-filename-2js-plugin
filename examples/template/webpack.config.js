const path = require('path')
const fs = require('fs-extra')
const Plugin = require('../../index')
const resolve = src => path.resolve(__dirname, src)
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
    filename: 'bundle.[hash:8].js'
  },
  plugins: [
    new Plugin([
      {
        targetTemplate: {
          entry: resolve('./template.js'),
          filename: 'template.[hash:8].js'
        },
        rules: [
          {
            regex: /inject-tag-lib1/,
            injectChunk: 'lib1'
          },
          {
            regex: /inject-tag-lib2/,
            injectChunk: 'lib2'
          }
        ]
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        lib1: {
          name: 'lib1',
          test: /lib1/,
          filename: 'lib1.[hash:8].js'
        },
        lib2: {
          name: 'lib2',
          test: /lib2/,
          filename: 'lib2.[hash:8].js'
        }
      }
    }
  }
}

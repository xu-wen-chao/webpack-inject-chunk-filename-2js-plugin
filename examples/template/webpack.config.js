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
          filename: 'dd/template.[hash:8].js'
        },
        rules: [
          {
            regex: /inject-tag-app/,
            injectChunk: 'app'
          }
        ]
      }
    ])
  ]
}

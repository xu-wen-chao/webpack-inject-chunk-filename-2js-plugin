const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Plugin = require('../../index')

module.exports = {
  context: __dirname,
  entry: {
    app: './example.js'
  },
  output: {
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Plugin([
      {
        targetChunk: 'app',
        rules: [
          {
            regex: /WebpackInjectChunkManifestAssetsPluginTag/,
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

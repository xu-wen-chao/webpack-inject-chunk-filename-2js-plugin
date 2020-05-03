const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Plugin = require('../../index')

module.exports = {
  context: __dirname,
  entry: {
    app: './example.js'
  },
  // mode: 'development',
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
            injectChunk: 'vendors'
          }
        ]
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 0,
      minChunks: 1,
      name: false,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          filename: 'vendors.[hash].js'
        }
      }
    }
  }
}

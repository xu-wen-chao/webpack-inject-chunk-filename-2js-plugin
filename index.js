const PluginName = 'WebpackInjectChunkManifestAssetsPlugin'

class Plugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync(PluginName, (compilation, callback) => {
      this.options.forEach((option) => {
        const { targetChunk, rules } = option
        const { namedChunks } = compilation

        rules.forEach((rule) => {
          const { regex, injectChunk } = rule
          const targetChunkFilename = namedChunks.get(targetChunk).files[0]
          const injectChunkFilename = namedChunks.get(injectChunk).files[0]

          let content = compilation.assets[targetChunkFilename].source()
          content = content.replace(regex, injectChunkFilename)

          compilation.assets[targetChunkFilename] = {
            source() {
              return content
            },
            size() {
              return content.length
            }
          }
        })
      })

      callback()
    })
  }
}

module.exports = Plugin

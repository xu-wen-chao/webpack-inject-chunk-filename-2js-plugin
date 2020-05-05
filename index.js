const PluginName = 'WebpackInjectChunkFilename2JsPlugin'

class Plugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emit.tap(PluginName, (compilation) => {
      this.options.forEach((option) => {
        const { targetChunk, rules } = option
        const { namedChunks } = compilation

        rules.forEach((rule) => {
          const { regex, injectChunk } = rule
          
          if (!namedChunks.has(targetChunk)) throw new Error(`targetChunk ${targetChunk} does not exist`)
          if (!namedChunks.has(injectChunk)) throw new Error(`injectChunk ${injectChunk} does not exist`)

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
    })
  }
}

module.exports = Plugin

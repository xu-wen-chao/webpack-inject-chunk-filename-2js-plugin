const PluginName = 'JsWebpackInlineSourcePlugin'

class Plugin {
  constructor(targets) {
    this.targets = targets
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync(PluginName, (compilation, callback) => {
      Object.keys(this.targets).forEach((key) => {
        this.targets[key].forEach((options) => {
          const targetFilename = compilation.namedChunks.get(key).files[0]
          const chunkFilename = compilation.namedChunks.get(options.chunkName).files[0]

          let content = compilation.assets[targetFilename].source()
          content = content.replace(options.regex, chunkFilename)

          compilation.assets[targetFilename] = {
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

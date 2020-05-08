const path = require('path')
const fs = require('fs')
const PluginName = 'WebpackInjectChunkFilenamePlugin'

class Plugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emit.tap(PluginName, (compilation) => {
      this.options.forEach((option) => {
        const { targetChunk, rules, targetTemplate } = option
        const { namedChunks, hash } = compilation

        // 遍历注入规则,进行文本替换/创建
        rules.forEach((rule) => {
          const { regex, injectChunk } = rule

          // 需要注入的chunk不存在,抛出错误
          if (!namedChunks.has(injectChunk)) {
            throw new Error(`injectChunk ${injectChunk} does not exist`)
          }

          const injectChunkFilename = namedChunks.get(injectChunk).files[0]

          // 如果待注入的是chunk,则对chunk的源文件进行替换修改
          if (targetChunk) {
            if (!namedChunks.has(targetChunk))
              throw new Error(`targetChunk ${targetChunk} does not exist`)
            const filename = namedChunks.get(targetChunk).files[0]
            const content = compilation.assets[filename]
              .source()
              .replace(regex, injectChunkFilename)
            compilation.assets[filename] = {
              source: () => content,
              size: () => content.length
            }
          }

          // 如果待注入的是模板,则读取模板文件,对其内容进行替换,然后添加到生成资源中
          if (targetTemplate) {
            let { filename, entry } = targetTemplate
            const hashRegExp = /.+(\[hash:?(\d*)\]).+/ // 用于获取配置filename中的hash信息的正则
            const hashRegExpGroup = filename.match(hashRegExp) // 分组捕获是否有hash以及hash的长度
            if (hashRegExpGroup) {
              // 有hash则将hash模板替换成本次编译的hash
              const length = hashRegExpGroup[2] || filename.length
              filename = filename.replace(hashRegExp, (match, $1) =>
                match.replace($1, hash.substring(0, +length))
              )
            }
            filename = path.basename(filename)
            let content = ''
            if (compilation.assets[filename]) {
              content = compilation.assets[filename].source()
            } else {
              // 模板文件不存在则抛出错误
              if (!fs.existsSync(entry))
                throw new Error(`targetTemplate.entry ${entry} does not exist`)
              content = fs.readFileSync(entry, { encoding: 'utf-8' })
            }
            content = content.replace(regex, injectChunkFilename)
            compilation.assets[filename] = {
              source: () => content,
              size: () => content.length
            }
          }
        })
      })
    })
  }
}

module.exports = Plugin

import Vue from 'vue'

const basic = () => console.log('basic')

console.log('WebpackInjectChunkManifestAssetsPluginTag')

Vue.prototype.$test = basic
window.$example = window.$example || {}
window.$example.basic = basic
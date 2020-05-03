import Vue from 'vue'

const basic = () => console.log('basic')

console.log('JsWebpackInlineSourcePluginTag')

Vue.prototype.$test = basic
window.$example = window.$example || {}
window.$example.basic = basic
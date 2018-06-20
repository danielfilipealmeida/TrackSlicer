import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import 'bulma/css/bulma.css'

import { FFMpeg } from '../modules/ffmpeg'
import path from 'path'
import { remote } from 'electron'

/**
 * Add to Vue
 */
Vue.prototype.$ffmpeg = new FFMpeg('/usr/local/bin/ffmpeg')
Vue.prototype.$path = path
Vue.prototype.$remote = remote

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')

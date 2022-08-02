import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VuePusher from 'vue-pusher';

Vue.config.productionTip = false
Vue.use(VuePusher, {
  api_key: '8bc6786b74e2be5c1a92',
  options: {
    cluster: 'eu',
  }
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')


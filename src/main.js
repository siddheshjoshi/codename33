import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import netlifyIdentity from 'netlify-identity-widget'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Multiselect from 'vue-multiselect'
Vue.component('multiselect', Multiselect)

netlifyIdentity.init({
  APIUrl: '/.netlify/identity',
  logo: false // you can try false and see what happens
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

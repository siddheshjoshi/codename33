import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import netlifyIdentity from 'netlify-identity-widget'

if (window.location.href.indexOf('localhost') > -1) {
  netlifyIdentity.init({
    APIUrl: '/.netlify/identity',
    logo: false // you can try false and see what happens
  })
} else {
  netlifyIdentity.init({
    APIUrl: 'https://fervent-ardinghelli-a38315.netlify.app/.netlify/identity',
    logo: true // you can try false and see what happens
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

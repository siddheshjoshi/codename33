import Vue from 'vue'
import VueRouter from 'vue-router'
import user from '../store/modules/user'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresLogin: false
      }
    },
    {
      path: '/',
      name: 'WelcomePage',
      component: () => import(/* webpackChunkName: "welcomePage" */ '../views/WelcomePage.vue'),
      meta: {
        requiresLogin: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresLogin) &&
  !user.state.user) {
    // You can use store variable here to access globalError or commit mutation
    next({ name: 'Login' })
  } else next()
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

export default router

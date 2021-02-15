import router from '../../router/index'
import netlifyIdentity from 'netlify-identity-widget'

const state = {
  user: window.localStorage.getItem('user')
}

const getters = {
  getUserStatus: state => !!state.user,
  getUser: state => JSON.parse(state.user)
}

// Mutations Must Be Synchronous
const mutations = {
  setUser: (state, currentUser) => {
    if (!currentUser) {
      state.user = null
      window.localStorage.removeItem('user')
      return
    }
    const theUser = JSON.stringify(currentUser)
    state.user = theUser
    window.localStorage.setItem('user', theUser)
  }
}

const actions = {
  updateUser: ({ commit }, payload) => {
    commit('setUser', payload.currentUser)
  },
  logout: ({ commit }) => {
    commit('setUser', null)
    netlifyIdentity.logout()
    router.push({ name: 'Login' })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

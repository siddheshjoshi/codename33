<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <button @click="triggerNetlifyIdentityAction('login')">Log In</button>
      <button @click="triggerNetlifyIdentityAction('signup')">Sign Up</button>
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import netlifyIdentity from 'netlify-identity-widget'
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', {
      isLoggedIn: 'getUserStatus',
      user: 'getUser'
    })
  },
  methods: {
    ...mapActions('user', {
      updateUser: 'updateUser'
    }),
    data: () => ({
      currentUser: null
    }),
    triggerNetlifyIdentityAction (action) {
      if (action === 'login' || action === 'signup') {
        netlifyIdentity.open(action)
        netlifyIdentity.on(action, user => {
          this.currentUser = {
            username: user.user_metadata.full_name,
            email: user.email,
            access_token: user.token.access_token,
            expires_at: user.token.expires_at,
            refresh_token: user.token.refresh_token,
            token_type: user.token.token_type
          }
          this.updateUser({
            currentUser: this.currentUser
          })
          netlifyIdentity.close()
        })
      } else if (action === 'logout') {
        this.currentUser = null
        this.updateUser({
          currentUser: this.currentUser
        })
        netlifyIdentity.logout()
        this.$router.push({ name: 'Home' })
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

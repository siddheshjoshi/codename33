<template>
  <div>
    <div v-if="!user">
      <button @click="triggerNetlifyIdentityAction('login')">Log In</button>
      <button @click="triggerNetlifyIdentityAction('signup')">Sign Up</button>
    </div>
    <button v-else @click="triggerNetlifyIdentityAction('logout')">Logout</button>
  </div>
</template>

<script>
import netlifyIdentity from 'netlify-identity-widget'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Login',
  components: {

  },
  computed: {
    ...mapGetters('user', {
      isLoggedIn: 'getUserStatus',
      user: 'getUser'
    })
  },
  created () {
  },
  methods: {
    ...mapActions('user', {
      updateUser: 'updateUser',
      logout: 'logout'
    }),
    data: () => ({
      currentUser: null
    }),
    triggerNetlifyIdentityAction (action) {
      netlifyIdentity.init()
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
          if (this.user) {
            this.$router.push({ name: 'WelcomePage' })
          }
        })
      } else if (action === 'logout') {
        this.logout()
      }
    }
  }
}
</script>

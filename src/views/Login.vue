<template>
  <div>
    <div class="container">
      <div class="row mt-5">
      <div v-if="!user">
        <button class="btn btn-outline-secondary mr-5 ml-5" @click="triggerNetlifyIdentityAction('login')">Log In</button>
        <button class="btn btn-outline-secondary" @click="triggerNetlifyIdentityAction('signup')">Sign Up</button>
      </div>
      <button v-else @click="triggerNetlifyIdentityAction('logout')">Logout</button>
      </div>
    </div>
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
          console.log(this.currentUser)
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

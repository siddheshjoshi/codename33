<template>
  <div>
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="about-project">
          <h2>CRUD Demo - Vue and Fauna</h2>
        </div>
        <div class="project-details m-3">
          <h5>
            This project is a prototype that chalks out a template for creating
            simple CRUD projects. <br />
            An outline for using <b>Fauna DB</b> with
            <b>Netlify Identity, Functions and Vue.js</b>
          </h5>
        </div>
        <div class="row"></div>
      </div>

      <div class="row justify-content-center mt-3" >
        <div v-if="!user">
          <button
            class="btn btn-outline-secondary mr-5"
            @click="triggerNetlifyIdentityAction('login')"
          >
            Log In
          </button>
          <button
            class="btn btn-outline-secondary"
            @click="triggerNetlifyIdentityAction('signup')"
          >
            Sign Up
          </button>
        </div>
        <button v-else @click="triggerNetlifyIdentityAction('logout')">
          Logout
        </button>
      </div>
    </div>
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-3 card-divs pt-5">
          <h2> Why another Todo list? </h2> 
          <p class="mt-4"> Because.. why not? <br/>
          It's the simplest example for CRUD applications
          </p>
        </div>
        <div class="col-md-3 card-divs pt-5">
          <h2>Stack</h2>
          <p class="mt-5"> 
            <ul>
              <li>Vue.js</li>
              <li>FaunaDB</li>
              <li>Functions</li>
            </ul>
          </p>
        </div>
        <div class="col-md-3 card-divs pt-5">
          <h2>Repo Links</h2>
          <p class="mt-5"> 
            <ul>
              <li>GitHub Link</li>
              <li>GitHub Functions Link</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import netlifyIdentity from "netlify-identity-widget";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Login",
  components: {},
  computed: {
    ...mapGetters("user", {
      isLoggedIn: "getUserStatus",
      user: "getUser",
    }),
  },
  created() {},
  methods: {
    ...mapActions("user", {
      updateUser: "updateUser",
      logout: "logout",
    }),
    data: () => ({
      currentUser: null,
    }),
    triggerNetlifyIdentityAction(action) {
      netlifyIdentity.init();
      if (action === "login" || action === "signup") {
        netlifyIdentity.open(action);
        netlifyIdentity.on(action, (user) => {
          this.currentUser = {
            username: user.user_metadata.full_name,
            email: user.email,
            access_token: user.token.access_token,
            expires_at: user.token.expires_at,
            refresh_token: user.token.refresh_token,
            token_type: user.token.token_type,
          };
          this.updateUser({
            currentUser: this.currentUser,
          });
          console.log(this.currentUser);
          netlifyIdentity.close();
          if (this.user) {
            this.$router.push({ name: "WelcomePage" });
          }
        });
      } else if (action === "logout") {
        this.logout();
      }
    },
  },
};
</script>

<style scoped>
/* source: https://www.pixeltrue.com/frontliner-heroes */

.card-divs {
  text-align: left;
  height: 400px;
  border: black;
  margin: 15px;
  border-radius: 10%;
  backdrop-filter: blur(50px);
  box-shadow: 10px 10px 5px grey;
  /* border: solid 1px; */
  padding-top: 10px;
  padding-bottom: 15px;
}

h3{
  text-align: center;
}
h5{
  text-align: center;
}
</style>

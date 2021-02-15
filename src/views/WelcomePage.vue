<template>
  <div class="about">
    <h1>This is a welcome page</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('user', {
      logout: 'logout'
    })
  }
}
</script>

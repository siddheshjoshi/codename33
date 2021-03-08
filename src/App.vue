<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style>
#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
/* source: https://www.pixeltrue.com/frontliner-heroes */
body {
  background-image: url('./assets/Frame 1.png');
  background-repeat:no-repeat;
  font-family: 'Poppins', sans-serif
}

html{
  font-family: 'Poppins', sans-serif
}
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap'); */
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;1,500&display=swap');

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

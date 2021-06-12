<template>
  <div id="app">
    <div id="nav" class="py-3">
      <a class="text-decoration-none px-3" href="/play">🎮</a>
      <router-link to="/leaderboard" class="text-decoration-none">🏆</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>


export default {
  data() {
    return {

    }
  },  
 
}
</script>

<style scoped>
#app{
  min-height: 100vh;
  background:#1d1d1d;
}
#nav{
  background: #424040;
  border-bottom: 1px solid white;
}
</style>
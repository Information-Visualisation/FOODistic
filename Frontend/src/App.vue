<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import Logo from './components/Logo.vue'
</script>

<template>
<nav class="navbar bg-body-tertiary">
  <div class="container-fluid">
    <a id="logo" class="navbar-brand"><Logo/></a>
    <div class="container-fluid d-flex flex-row justify-content-center">
      <form class="d-flex" role="search">
        <input class="form-control me-2 focus-ring-danger" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-danger" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
<RouterView/>
</template>

<!-- <template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>

    </div>
  </header>

  <RouterView />
</template> -->

<style scoped>
.form-control:focus {
  border-color: brown;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);
}

nav {
  background-color:antiquewhite;
}

#logo {
  position: absolute;
}
</style>

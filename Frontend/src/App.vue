<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Logo from './components/Logo.vue'
</script>

<script lang="ts">
import { DBService } from './services/db.service'
const dbService = new DBService;

export default {
}
</script>

<template>
  <nav id="main-nav" class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <a id="logo" class="navbar-brand" @click="$router.push({ name: 'home' })">
        <Logo />
      </a>
      <!-- <div class="container-fluid d-flex flex-row justify-content-center">
        <button type="button" class="btn btn-success" @click="$router.push({ name: 'home' })"> Home</button>
        <button type="button" class="btn btn-success" @click="$router.push({ name: 'about' })"> About</button>
      </div> -->
    </div>
  </nav>

  <RouterView />
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

<style scoped lang="scss">
@import "../scss/custom.scss";

#main-nav {
  background-color: $app-light;
}

#logo {
  cursor: pointer;
  // position: absolute;
}

.dropdown-menu {
  max-height: 280px;
  overflow-y: auto;
}</style>

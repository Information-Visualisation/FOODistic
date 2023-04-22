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
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <a id="logo" class="navbar-brand">
        <Logo />
      </a>
      <div class="container-fluid d-flex flex-row justify-content-center">
        <button type="button" class="btn btn-outline-danger" @click="$router.push({ name: 'home' })"> Home</button>
        <button type="button" class="btn btn-outline-danger" @click="$router.push({ name: 'about' })"> About</button>
      </div>
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

<style scoped>
.form-control:focus {
  border-color: brown;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);
}

nav {
  background-color: antiquewhite;
}

#logo {
  position: absolute;
}

.dropdown-menu {
  max-height: 280px;
  overflow-y: auto;
}</style>

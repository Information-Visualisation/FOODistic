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
      </div> -->
      <div>
        <button type="button" class="btn btn-success" @click="$router.push({ name: 'about' })"> About</button>
        <button class="btn btn-info help" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample"
          aria-expanded="false" aria-controls="collapseExample">
          Help <b>?</b>
        </button>
      </div>
    </div>
  </nav>

  <RouterView />
</template>

<style scoped lang="scss">
@import "../scss/custom.scss";
@import "../scss/foodButtons.scss";

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
}

.help {
  margin-left: 10px;
}
</style>

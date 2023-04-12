<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import Logo from './components/Logo.vue'
import FilterButton from './components/FilterButton.vue'
</script>

<script lang="ts">
import { DBService } from './services/db.service'
import HomeView from './views/HomeView.vue'
const dbService = new DBService;
const result = await dbService.query("SELECT DISTINCT allergy FROM allergies WHERE allergy IS NOT NULL;");

export default {
  components: {
    FilterButton
  },
  data() {
    return {
      filteritems: result,
      search: ''
    }
  },
  created: function () {
  },
  methods:{
    searchSubmit(){
      console.log(this.search)
      this.$router.push({ name: 'search', params : { searchitem: this.search } })
    }
  }
}
</script>

<template>
<nav class="navbar bg-body-tertiary">
  <div class="container-fluid">
    <a id="logo" class="navbar-brand"><Logo/></a>
    <div class="container-fluid d-flex flex-row justify-content-center">
      <form class="d-flex" role="search">
        <input class="form-control me-2 focus-ring-danger" type="search" placeholder="Search" aria-label="Search" v-model="search">
        <div class="btn-group">
        <button type="button" class="btn btn-outline-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        Filter
        </button>
        <ul class="dropdown-menu">
          <FilterButton v-for="filteritem in filteritems" :title=filteritem.allergy></FilterButton>
        </ul>
        </div>
        <button class="btn btn-outline-danger" type="submit" @click="searchSubmit">Search</button>
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

.dropdown-menu {
    max-height: 280px;
    overflow-y: auto;
}
</style>

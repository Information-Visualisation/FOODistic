<script lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
export default {
  data() {
    return {
      a: 0
    }
  },
  created: function () {
  },
}

</script>

<template>
  <main>
    <nav class="d-flex flex-column">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/foodgroup/fruits">Fruits</RouterLink>
      <RouterLink to="/subfoodgroup/red-fruits">Red Fruits</RouterLink>
      <RouterLink to="/food/apple">Apple</RouterLink>
    </nav>
    <div>
      <p>{{ a }}</p>
    </div>
  </main>
</template>

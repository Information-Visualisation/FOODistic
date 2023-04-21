<script lang="ts">
import FoodPicker from '../components/FoodPicker.vue';

export default {
  components: {
    FoodPicker
  },
  data() {
    return {
      foodName: "",
      offset: 0,
    }
  },
  created: async function () {
    const querySearch = this.$route.query.search;
    const queryOffset = this.$route.query.offset;
    let foodName: string = ""
    let offset: Number = 0;
    if (typeof querySearch === 'string') {
      foodName = querySearch;
    }
    if (typeof queryOffset === 'number') {
      offset = queryOffset;
    }
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
    <FoodPicker :query="foodName" :offset="offset"></FoodPicker>
  </main>
</template>

<style>
.container {
  padding: 40px;
}
</style>

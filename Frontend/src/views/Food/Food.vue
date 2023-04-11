<script lang="ts">
import FoodGraph from './FoodGraph.vue';

export default {
  components: {
    FoodGraph: FoodGraph
}
}
</script>

<template>
  <h1>Food: {{ $route.params.name }}</h1>
  <FoodGraph id="11"/>
</template>

<style></style>
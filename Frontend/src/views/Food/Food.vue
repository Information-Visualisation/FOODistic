<script lang="ts">
import NutrientGraph from './NutrientGraph.vue';
import RecipesList from './RecipesList.vue';

export default {
  components: {
    NutrientGraph: NutrientGraph,
    RecipesList: RecipesList,
}
}
</script>

<template>
  <h1>Food: {{ $route.params.name }}</h1>
  <NutrientGraph id="11"/>
  <RecipesList id="11"/>
  <AllergyList id="11"/>
</template>

<style></style>
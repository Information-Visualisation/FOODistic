<script lang="ts">
import NutrientGraph from './NutrientGraph.vue';
import RecipesList from './RecipesList.vue';

export default {
  components: {
    NutrientGraph: NutrientGraph,
    RecipesList: RecipesList,
  },
  data() {
    return {
      id: "",
    }
  },
  methods: {
    formatQuery() {
      const id = this.$route.query.id
      if (typeof id === 'string') {
        this.id = id;
      }
    }
  },
  created() {
    this.formatQuery();
  }
}
</script>

<template>
  <h1>Food: {{ $route.params.name }}</h1>
  <h2>Id: {{ $route.query.id }}</h2>

  <NutrientGraph :id="id" />
  <RecipesList :id="id" />
  <!-- <AllergyList :id="id" /> -->
</template>

<style></style>
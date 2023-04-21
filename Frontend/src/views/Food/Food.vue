<script lang="ts">
import FoodImg from '@/components/FoodImg.vue';
import NutrientGraph from './NutrientGraph.vue';
import RecipesList from './RecipesList.vue';
import { DBService } from '@/services/db.service';
import { GET_FOOD_FOR_ID } from '@/services/queries';

const dbService = new DBService;

export default {
  components: {
    NutrientGraph: NutrientGraph,
    RecipesList: RecipesList,
    FoodImg
},
  data() {
    return {
      id: "",
      row: null,
    }
  },
  methods: {
    formatQuery() {
      const id = this.$route.query.id
      if (typeof id === 'string') {
        this.id = id;
      }
    },
    async fetchData() {
      this.row = await dbService.query(GET_FOOD_FOR_ID(this.id));
    },
    getName(): string {
      return this.$route.params.name as string;
    }
  },
  created() {
    this.formatQuery();
  }
}
</script>

<template>
  <div class="position-relative">
    <FoodImg class="position-absolute top-0 start-0 m-3" :id="id" :name="getName()"></FoodImg>
    <div class="col title">
      <h1>Food: {{ $route.params.name }}</h1>
      <h2>Id: {{ $route.query.id }}</h2>
    </div>

    <div class="position-absolute top-0 end-0 m-3">
      <a class="btn btn-primary mb-3" href="#" role="button">Compare ▶</a><br>
      <button class="btn btn-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample"
        aria-expanded="false" aria-controls="collapseExample">
        Help <b>?</b>
      </button>
    </div>
  </div>

  <div class="d-flex justify-content-center">
    <div class="row">
      <div class="col">
        <NutrientGraph :id="id" class="card" />
      </div>
      <div class="col">
        <RecipesList :id="id" class="card" />
      </div>
    </div>
  </div>
</template>

<style>
h1,
h2 {
  padding-top: 5px;
  padding-left: 30px;
}

.title {
  left: 80px;
}

.card {
  padding: 10px;
}
</style>
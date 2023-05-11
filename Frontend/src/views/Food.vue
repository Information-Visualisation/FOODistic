<script lang="ts">
import FoodImg from '@/components/FoodImg.vue';
import NutrientGraph from '../components/NutrientGraph.vue';
import RecipesList from '../components/RecipesList.vue';
import { DBService } from '@/services/db.service';
import { GET_FOOD_FOR_ID } from '@/services/queries';

const dbService = new DBService;

export default {
  props: {
    idp: {
      type: String,
      default: ""
    }
  },
  components: {
    NutrientGraph: NutrientGraph,
    RecipesList: RecipesList,
    FoodImg
  },
  data() {
    return {
      id: this.$route.query.id as string,
      name: '',
      row: null,
      foodGroup: "",
      subFoodGroup: "",
    }
  },
  created() {
    this.id = this.idp !== '' ? this.idp as string : this.id;
    this.fetchData(this.id);
  },
  methods: {
    async fetchData(id: string) {
      this.row = await dbService.query(GET_FOOD_FOR_ID(id));
      this.row = this.row.rows[0];
      this.name = this.row.naam;
      this.setFoodGroups();
    },
    setFoodGroups() {
      this.foodGroup = this.row.food_group;
      this.subFoodGroup = this.row.food_subgroup;
    },
  },
}
</script>

<template>
  <nav aria-label="breadcrumb" class="crumbs">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <RouterLink to="/">Home</RouterLink>
      </li>
      <li class="breadcrumb-item">
        <a v-if="foodGroup == ''">Loading</a>
        <RouterLink v-if="foodGroup != ''" :to="{name: 'home', query: { foodgroup: foodGroup }}">{{ foodGroup }}</RouterLink>
      </li>
      <li class="breadcrumb-item">
        <a v-if="subFoodGroup == ''">Loading</a>
        <RouterLink v-if="subFoodGroup != ''" :to="{name: 'home', query: { foodgroup: foodGroup, subfoodgroup: subFoodGroup }}">{{ subFoodGroup }}</RouterLink>
      </li>
      <li class="breadcrumb-item active" aria-current="page">{{ name }}</li>
    </ol>
  </nav>

  <div class="d-flex justify-content-start header">
    <div class="">
      <FoodImg class="image" :id="id" :name="name" :height="35"></FoodImg>
    </div>
    <div class="">
      <h1 class="title">{{ name }}</h1>
      <!-- <h2>Id: {{ id }}</h2> -->
    </div>
  </div>

  <div class="d-flex justify-content-center content">
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

.card {
  padding: 10px;
  margin: 10px;
}

.crumbs {
  margin: 4px;
}

.image {
  margin: 10px;
}

.title {
  margin-top: 4px;
  margin-left: 0px;
  padding-left: 3px;
}

.header {
  margin-left: 50px;
}

.content {
  padding-left: 50px;
}
</style>
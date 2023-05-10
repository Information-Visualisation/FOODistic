<script lang="ts">
import FoodImg from '@/components/FoodImg.vue';
import NutrientGraph from '../components/NutrientGraph.vue';
import RecipesList from '../components/RecipesList.vue';
import { DBService } from '@/services/db.service';
import type { FoodRow } from '@/services/dbClasses';
import { GET_FOOD_FOR_ID, GET_ALLERGY_FOR } from '@/services/queries';

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
      row: {} as FoodRow,
      foodGroup: "",
      subFoodGroup: "",
      allergies: {},
    }
  },
  created() {
    this.id = this.idp !== '' ? this.idp as string : this.id;
    this.fetchData(this.id);
  },
  methods: {
    async fetchData(id: string) {
      this.row = (await dbService.query(GET_FOOD_FOR_ID(id))).rows[0];
      this.name = this.row.naam;
      console.log(this.name)
      let result3 = await dbService.query(GET_ALLERGY_FOR("'"+this.name+"'"));
      this.allergies = result3.rows;
      console.log(this.allergies)
      this.setFoodGroups();
    },
    setFoodGroups() {
      this.foodGroup = this.row.food_group;
      this.subFoodGroup = this.row.food_subgroup;
    },
    getImageUrl(allergy: string) {
        console.log(allergy)
        if (allergy.includes('Lactose')) {
            return new URL(`../assets/allergies/Lactose intolerance.png`, import.meta.url).href
        }
        let url: string = new URL(`../assets/allergies/${allergy}.png`, import.meta.url).href;
        return url.includes('undefined') ? new URL(`../assets/allergies/checkbox.png`, import.meta.url).href : url;
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

  <div class="position-relative">
    <FoodImg class="position-absolute top-0 start-0 m-3" :id="id" :name="name"></FoodImg>
    <div class="col title">
      <h1>Food: {{ name }}</h1>
      <h2>Id: {{ id }}</h2>
      <div v-if="allergies.length >= 1">
        <h2>Allergies: <div v-for="allergy in allergies">
            <img :title=allergy.allergy :src="getImageUrl(allergy.allergy)" style="width: 50px"/>
        </div></h2>
      </div>
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

.crumbs {
  margin: 4px;
}
</style>
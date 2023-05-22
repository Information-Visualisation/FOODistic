<script lang="ts">
import SpinnerComponent from './SpinnerComponent.vue';
import NutrientGraph from '../components/NutrientGraph.vue';
import RecipesList from '../components/RecipesList.vue';
import FoodTitleTag from '../components/FoodTitleTag.vue';
import IconMaximize from '../components/icons/IconMaximize.vue';
import IconMinimize from '../components/icons/IconMinimize.vue';
import { DBService } from '@/services/db.service';
import type { FoodRow } from '@/services/dbClasses';
import { GET_FOOD_FOR_ID } from '@/services/queries';

const dbService = new DBService;

export default {
  props: {
    idp: {
      type: String,
      default: ""
    },
    otherIds: {
      type: Array<string>,
      default: []
    }
  },
  components: {
    NutrientGraph: NutrientGraph,
    RecipesList: RecipesList,
    FoodTitleTag,
    SpinnerComponent,
    IconMaximize,
    IconMinimize,
  },
  data() {
    return {
      id: this.$route.query.id as string,
      isIdSet: false,
      name: '',
      row: {} as FoodRow,
      foodGroup: "",
      subFoodGroup: "",
      otherFoods: [] as unknown as [FoodRow],
      loading: false,
      isMinimized: false,
    }
  },
  async created() {
    this.id = this.idp !== '' ? this.idp as string : this.id;
    this.isIdSet = true;
    this.row = await this.fetchData(this.id);
    this.setFoodGroups();
    this.name = this.row.naam;

    this.setOtherFoods();
  },
  methods: {
    async fetchData(id: string): Promise<FoodRow> {
      return (await dbService.query(GET_FOOD_FOR_ID(id))).rows[0];
    },
    setFoodGroups() {
      this.foodGroup = this.row.food_group;
      this.subFoodGroup = this.row.food_subgroup;
    },
    async setOtherFoods() {
      this.isLoading();
      if (this.otherIds.length > 0) {
        this.otherIds.forEach(async (id) => {
          this.otherFoods.push(await this.fetchData(id as string));
        })
      }
      this.loading = false;
    },
    isLoading() {
      this.loading = true;
    },
    makeMain() {
      this.$router.push({
        name: 'food',
        params: {
          name: this.$route.params.name,
        },
        query: {
          id: this.id,
        }
      });
    },
    deletePicked(event: any, id: string) {
      this.$emit('deletePicked', null, id);
    },
    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
    },
    getImageUrl(allergy: string) {
      if (allergy.includes('Lactose')) {
        return new URL(`../assets/allergies/Lactose intolerance.png`, import.meta.url).href;
      }
      let url: string = new URL(`../assets/allergies/${allergy}.png`, import.meta.url).href;
      return url.includes('undefined') ? new URL(`../assets/allergies/checkbox.png`, import.meta.url).href : url;
    },
    getAllIds(): Array<String> {
      let ids: Array<String> = [this.id];
      ids = ids.concat(this.otherIds);
      return ids;
    }
  },
  emits: ["deletePicked"],
  watch: {
    otherIds(newV, oldV) {
      //console.log("does this even?");
      // this.setOtherFoods();
    },
  }
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
        <RouterLink v-if="foodGroup != ''" :to="{ name: 'home', query: { foodgroup: foodGroup } }">{{ foodGroup }}
        </RouterLink>
      </li>
      <li class="breadcrumb-item">
        <a v-if="subFoodGroup == ''">Loading</a>
        <RouterLink v-if="subFoodGroup != ''"
          :to="{ name: 'home', query: { foodgroup: foodGroup, subfoodgroup: subFoodGroup } }">{{ subFoodGroup }}
        </RouterLink>
      </li>
      <li class="breadcrumb-item active" aria-current="page">{{ name }}</li>
    </ol>
  </nav>

  <div class="d-flex justify-content-start flex-wrap header">
    <SpinnerComponent v-if="loading"></SpinnerComponent>
    <FoodTitleTag v-if="isIdSet" :foodNum="otherFoods.length > 0 ? 1 : 0" :id="id" :name="name" :allowClose="false" :isMinimized="isMinimized"></FoodTitleTag>
    <FoodTitleTag v-if="otherFoods.length > 0" v-for="(food, index) in otherFoods" :foodNum="index+2" :id="food.id.toString()" :name="food.naam"
      :allowClose="true" :isMinimized="isMinimized" @deletePicked="deletePicked"></FoodTitleTag>
    <button v-if="!isMinimized" type="button" class="btn align-self-center" @click="toggleMinimize()">
      <IconMaximize></IconMaximize>
      <!-- Minimize -->
    </button>
    <button v-if="isMinimized" type="button" class="btn align-self-center" @click="toggleMinimize()">
      <IconMinimize></IconMinimize>
      <!-- Maximize -->
    </button>
  </div>

  <div class="d-flex justify-content-center content">
    <div class="row">
      <div class="col">
        <NutrientGraph :ids="getAllIds()" class="card" />
      </div>
      <div class="col">
        <RecipesList :ids="getAllIds()" class="card" />
      </div>
    </div>
  </div>
</template>

<style>
h1,
h2,
h3 {
  padding-top: 5px;
  padding-left: 30px;
}

.h-scroll {
  width: 90em;
  overflow-x: auto;
  white-space: nowrap;
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

.header {
  margin: 0 120px 0 50px;
}

.content {
  padding-left: 50px;
}

.minimizeBtn {
  height: 30px;
}
</style>
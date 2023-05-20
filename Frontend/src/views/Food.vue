<script lang="ts">
import SpinnerComponent from './SpinnerComponent.vue';
import NutrientGraph from '../components/NutrientGraph.vue';
import RecipesList from '../components/RecipesList.vue';
import FoodTitleTag from '../components/FoodTitleTag.vue';
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
          this.otherFoods.push(await this.fetchData(id));
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
    <FoodTitleTag v-if="isIdSet" :id="id" :name="name" :allowClose="false"></FoodTitleTag>
    <FoodTitleTag v-if="otherFoods.length > 0" v-for="food in otherFoods" :id="food.id.toString()"
      :name="food.naam" :allowClose="true" @deletePicked="deletePicked"></FoodTitleTag>
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
  margin: 0 50px 0 50px;
}

.content {
  padding-left: 50px;
}
</style>
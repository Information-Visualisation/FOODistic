<script lang="ts">
import { stringifyExpression } from '@vue/compiler-core';
import FoodItem from '../components/FoodItem.vue'
import { DBService } from '../services/db.service'
import type { Rows, Row} from '../services/db.service';

const dbService = new DBService;
export default {
  components: {
    FoodItem,
  },
  data() {
    return {
      isLoading: true,
      result_foodGroup: null as unknown as Rows,
      foodGroupitems: null as unknown as Rows,
      result_food: null as unknown as Rows,
      fooditems: null as unknown as Rows,
      selectedFoodGroup: 'All',
    }
  },
  created: function () {
    this.queryALL().then(() => {
      this.setResultQuery();
    });
  },
  methods:{
    async queryALL(){
      this.result_foodGroup = await dbService.query(`SELECT DISTINCT food_group FROM food WHERE food_group is NOT NULL`);
      this.result_food = await dbService.query(`SELECT id,naam FROM food LIMIT 50`);
     this.$nextTick(() => {
        this.loaded();
      })
    },
    loaded() {
      this.isLoading = false;
    },
    setResultQuery(){
      this.fooditems = this.result_food;
      this.foodGroupitems = this.result_foodGroup;
    },
    goToPage(pagename: any, nameFood?: any){
      this.$router.push({ name: pagename, params : { name: nameFood } })
    },
    setSelectedItem(foodgroup: any){
      this.selectedFoodGroup = foodgroup;
      this.isLoading = true;
      this.queryFoodGroup().then(() => {
        this.setResultQuery();
      });
    },
    async queryFoodGroup(){
      if (this.selectedFoodGroup == 'All')
        this.result_food = await dbService.query(`SELECT id,naam FROM food LIMIT 40`);
      else
        this.result_food = await dbService.query(`SELECT id,naam FROM food WHERE ( food.food_group = '`+this.selectedFoodGroup+`')`);
      this.$nextTick(() => {
        this.loaded();
      })
    }
  }
}

</script>

<template>
  <main>
    <div>
      <div class="position-relative" v-if="isLoading">
          <p>is loading</p>
      </div>
      <div class="container" v-else="!isLoading">
        <div>
          <h1>Food group:</h1>
          <div class="btn-group">
            <button type="button" class="btn btn-outline-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{{selectedFoodGroup}}</button>
            <ul class="dropdown-menu">
              <li class="dropdown-item" @click="setSelectedItem('All')">All foodgroups</li>
              <li class="dropdown-item" v-for="foodGroupitem in foodGroupitems" @click="setSelectedItem(foodGroupitem.food_group)">{{foodGroupitem.food_group}}</li>
            </ul>
          </div>
        </div>
        <div>
          <h1>Food:</h1>
          <FoodItem v-for="fooditem in fooditems" :title=fooditem.naam @click="goToPage('food',fooditem.naam)"> <!-- change to goToFoodPage(fooditem.id) --></FoodItem>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.container {
 padding: 40px;
}
.dropdown-item:hover{
    background-color:red;
 }
 .dropdown-menu {
    max-height: 280px;
    overflow-y: auto;
}
</style>

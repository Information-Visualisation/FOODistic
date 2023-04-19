<script lang="ts">
import { stringifyExpression } from '@vue/compiler-core';
import FoodItem from '../components/FoodItem.vue'
import { DBService } from '../services/db.service'
import type { Rows, Row} from '../services/db.service';

const dbService = new DBService;
export default {
  props: ['searchitem'],
  components: {
    FoodItem,
  },
  data() {
    return {
      isLoading: true,
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
        this.result_food = await dbService.query(`SELECT id,naam FROM food WHERE ( Lower(food.naam) LIKE '%`+this.searchitem+`%')`);
        this.$nextTick(() => {
            this.loaded();
        })
    },
    loaded() {
      this.isLoading = false;
    },
    setResultQuery(){
      this.fooditems = this.result_food;
    },
    goToPage(pagename: any, nameFood?: any){
      this.$router.push({ name: pagename, params : { name: nameFood } })
    },
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
        <div v-if="fooditems.length != 0 && searchitem != undefined">
          <h1>You searched for: {{ searchitem }}</h1>
          <FoodItem v-for="fooditem in fooditems" :title=fooditem.naam @click="goToPage('food',fooditem.naam)"> <!-- change to goToFoodPage(fooditem.id) --></FoodItem>
        </div>
        <div v-else="fooditems.length == 0">
            <h1>No results found for {{searchitem}}!</h1>
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

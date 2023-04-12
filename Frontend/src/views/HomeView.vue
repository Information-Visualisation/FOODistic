<script lang="ts">
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
      result: null as unknown as Rows,
      fooditems: null as unknown as Rows,
    }
  },
  created: function () {
    this.query().then(() => {
      this.setResult();
    });
  },
  methods:{
    async query(){
      if (this.searchitem == undefined)
        this.result = await dbService.query(`SELECT id,naam FROM food LIMIT 30`);
      else
        this.result = await dbService.query(`SELECT id,naam FROM food WHERE ( food.naam = '`+this.searchitem+`')`);
      this.$nextTick(() => {
        this.loaded();
      })
    },
    loaded() {
      this.isLoading = false;
    },
    setResult(){
      this.fooditems = this.result;
      console.log(this.fooditems)
      console.log(this.searchitem)
    }
  }
}

</script>

<template>
  <main>
    <nav class="d-flex flex-column">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/foodgroup/fruits">Fruits</RouterLink>
      <RouterLink to="/subfoodgroup/red-fruits">Red Fruits</RouterLink>
      <RouterLink to="/food/apple">Apple</RouterLink>
    </nav>
    <div>
      <div class="position-relative" v-if="isLoading">
          <p>is loading</p>
      </div>
      <div class="container" v-else="!isLoading">
        <FoodItem v-for="fooditem in fooditems" :title=fooditem.naam></FoodItem>
      </div>
    </div>
  </main>
</template>

<style>
.container {
 padding: 40px;
}
</style>

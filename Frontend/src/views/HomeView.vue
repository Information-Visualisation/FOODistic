<script lang="ts">
import FoodItem from '../components/FoodItem.vue'
import SpinnerComponent from './SpinnerComponent.vue';
import { DBService } from '../services/db.service'
import { GET_FOOD_FOR } from '@/services/queries';

export default {
  components: {
    FoodItem,
    SpinnerComponent
  },
  data() {
    return {
      fooditems: null
    }
  },
  created: async function () {
    const querySearch = this.$route.query.search;
    const queryOffset = this.$route.query.offset;
    let foodName: string = ""
    let offset: Number = 0;
    if (typeof querySearch === 'string') {
      foodName = querySearch;
    }
    if (typeof queryOffset === 'number') {
      offset = queryOffset;
    }

    const dbService = new DBService;
    this.fooditems = await dbService.query(GET_FOOD_FOR(foodName, offset));
  },
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
      <div class="container">
        <div v-if="fooditems === null">
          <SpinnerComponent />
        </div>
        <div v-else="fooditems!==null">
          <div v-if="fooditems.rows.length==0">No results found</div>
          <FoodItem v-for="fooditem in fooditems.rows" :food-name=fooditem.naam :id=fooditem.id></FoodItem>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.container {
  padding: 40px;
}
</style>

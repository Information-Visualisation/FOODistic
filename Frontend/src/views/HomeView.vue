<script lang="ts">
import FoodItem from '../components/FoodItem.vue'
import { DBService } from '../services/db.service'

const dbService = new DBService;
const result = await dbService.query("SELECT id,naam FROM food LIMIT 10");

export default {
  components: {
    FoodItem
  },
  data() {
    return {
      fooditems: ['Apple',
    'Pear',
  'Peach', 'banana', 'pineapple', 'coconut']
    }
  },
  created: function () {
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
      <FoodItem v-for="fooditem in fooditems" :title=fooditem></FoodItem>
      </div>
    </div>
  </main>
</template>

<style>
.container {
 padding: 40px;
}
</style>

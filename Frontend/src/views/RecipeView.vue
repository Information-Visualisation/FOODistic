<script lang="ts">
import { DBService, distinctNames, type DistinctRows } from '@/services/db.service';
import { GET_RECIPE } from '@/services/queries';
import NutrientGraphRecipe from "../components/NutrientGraphRecipe.vue";

const dbService = new DBService;

export default {
    components:{
        NutrientGraphRecipe,
    },
    data() {
        return {
            isLoading: true,
            id: this.$route.query.id as string,
            result: {},
        }
    },
    created(){
        this.fetchData();
    },
    methods:{
        async fetchData() {
            let result2 = await dbService.query(GET_RECIPE(this.id));
            this.result = result2.rows[0];
            this.$nextTick(() => {
                console.log(this.result);
                this.loaded();
            })
        },
        loaded() {
            this.isLoading = false;
        },
        test(){
            console.log(this.result);
            return "hai";
        }
}
}
</script>
<template>
     <div v-if="isLoading" class="position-relative">
        <h1>Test {{ test() }}</h1>
    </div>
    <div v-else="!isLoading" class="position-relative">
        <h1>{{ result.recipename }}</h1>
    </div>
    <div class="d-flex justify-content-center">
    <div class="row">
      <div class="col">
        <NutrientGraphRecipe :id="id" class="card" />
      </div>
    </div>
  </div>
</template>

<style>
</style>
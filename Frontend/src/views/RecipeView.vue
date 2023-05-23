<script lang="ts">
import { DBService, distinctNames } from '@/services/db.service';
import type { DistinctRows } from '@/services/dbClasses';
import { GET_ALLERGIES_RECIPE, GET_RECIPE } from '@/services/queries';
import NutrientGraphRecipe from "../components/NutrientGraphRecipe.vue";
import FoodItem from "../components/FoodItem.vue";
import TechniqueIcon from "../components/TechniqueIcon.vue";
import { getFilteredTechniques } from '@/services/cookingtechniques';
import type { RecipesRow } from '@/services/dbClasses';

const dbService = new DBService;

export default {
    components:{
        NutrientGraphRecipe,
        FoodItem,
        TechniqueIcon
    },
    props:{
        comparing: {type: Boolean, default: false},
    },
    data() {
        return {
            isLoading: true,
            id: this.$route.query.id as string,
            recipe: {} as {[key: number]: RecipesRow},
            allergies: {} as { [key: number]: {allergy: string}},
            techniqueStrings: [''],
        }
    },
    created(){
        this.fetchData();
    },
    emits: ["compare"],
    methods:{
        async fetchData() {
            this.recipe = (await dbService.query(GET_RECIPE(this.id))).rows;
            this.techniqueStrings = getFilteredTechniques(this.recipe[0].techniques);
            this.allergies = (await dbService.query(GET_ALLERGIES_RECIPE(this.getFoods()))).rows;
            this.$nextTick(() => {
                this.loaded();
            })
        },
        loaded() {
            this.isLoading = false;
        },
        getFoods(){
            let foodstring = "(";
            let size = Object.keys(this.recipe).length;
            for(let i = 0; i < size; i++){
                if (i+1 != size)
                    foodstring += "'" + this.recipe[i].foodname +"',";
                else
                    foodstring += "'" + this.recipe[i].foodname +"'";
            }
            foodstring += ")";
            return foodstring;
        },
        changeIngredientToArray(ingredientRow: any){
            let ingredientArray = new Array<string>;
            if (ingredientRow != "") {
              for (var ingredient of ingredientRow) {
                ingredientArray.push(ingredient);
              }
            }
            return ingredientArray;
        },
        replaceAanhaling(ingredient: string){
            let count = 0;
            var result = '';
            for(let x = 0; x < ingredient.length-1; x++){
                if(ingredient[x] == "'"){
                    if (count%2 != 0){
                        count += 1;
                        result = ingredient.slice(0,x) + "'" + ingredient.slice(x);
                    }else{
                        count += 1;
                    }
                }
            }
            if(result == '')
                result = ingredient;
            return result
        },
        compare(event: any, id: String) {
            this.$emit('compare', null, id);
        },
        getImageUrl(allergy: string) {
            if (allergy.includes('Lactose')) {
                return new URL(`../assets/allergies/Lactose intolerance.png`, import.meta.url).href;
            }
            let url: string = new URL(`../assets/allergies/${allergy}.png`, import.meta.url).href;
            return url.includes('undefined') ? new URL(`../assets/allergies/checkbox.png`, import.meta.url).href : url;
        }
}
}
</script>
<template>
     <div v-if="isLoading" class="position-relative">
    </div>
    <div v-else="!isLoading" class="position-relative">
        <h1>{{ recipe[0].recipename }}</h1>
    </div>
    <div class="d-flex position-relative">
        <h1>Ingredients: </h1>
        
    </div>
    <div class="d-flex justify-content-center">
        <div class="row">
        <FoodItem v-for="food in recipe" :name=food.foodname :id="food.foodid.toString()"
            :comparing="comparing" @compare="compare"></FoodItem>
        </div>
    </div>
    
    <div class="d-flex justify-content-center">
        <h2>Allergies:</h2>
        <div v-for="allergy in allergies">
            <img :title=allergy.allergy :src="getImageUrl(allergy.allergy)" style="width: 50px"/>
        </div>
    </div>
    <div class="d-flex justify-content-center">
        <h2>Cooking techniques:</h2>
        <div v-for="technique in techniqueStrings">
                <img class="box" :title=technique :src="'/src/assets/cookingtechniques/' + technique + '.png'" />
        </div>
    </div>
    <h2>Nutrients:</h2>
    <div class="d-flex justify-content-center">
            <NutrientGraphRecipe :id="parseInt(id)" class="card" />
  </div>
</template>

<style scoped>
.box {
    width: 50px;
    height: 50px;
    font-family: arial;
}
</style>
<script lang="ts">
import TableRowHead from './TableRowHead.vue';
import TableGraph from './TableGraphs.vue';
import TableRowNutrition from './TableRowNutrition.vue';
import TableRowAllergy from './TableRowAllergy.vue';
import FoodPicker from '@/components/FoodPicker.vue';
import RecipesList from '@/components/RecipesList.vue';
import SpinnerComponent from '../SpinnerComponent.vue';
import { MACRO_NUTRIENTS_FOR, GET_ALLERGIES_PER_FOOD_FOR, COUNT_ALLERGIES_FOR } from '@/services/queries';
import { DBService, distinctNames } from '@/services/db.service';
import type { DistinctRows, FoodRow, AllergyPercentageRow, FoodAllergyRow } from '@/services/dbClasses';
import { mean } from '@/services/statistics';

const dbService = new DBService;

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    components: {
        TableGraph,
        TableRowHead,
        TableRowNutrition,
        FoodPicker,
        RecipesList,
        SpinnerComponent,
        TableRowAllergy
    },
    data() {
        return {
            foodItems: [] as FoodRow[],
            foodNutritions: Object() as {[key: string]: number[]},
            tabIndex: 0,
            allergiesPerFood: [] as FoodAllergyRow[],
            allergyPercentages: [] as AllergyPercentageRow[],
            nutritionHeaders: ['Ash', 'Carbohydrate', 'Fat', 'Fatty Acid', 'Fiber', 'Proteins'],
        }
    },
    created() {
    },
    watch: {
        data(newV, oldV) {
            //console.log(newV);
        }
    },
    emits: ["returnTotalCount"],
    computed: {
        getAllergyNames() : string[] {
            let allergies = [];
            for (let i = 0; i < this.allergyPercentages.length; ++i) {
                allergies.push(this.allergyPercentages[i].allergy);
            }
            return allergies;
        },
        getAllergyPercentages() : number[] {
            let percentages = [];
            for (let i = 0; i < this.allergyPercentages.length; ++i) {
                percentages.push(this.allergyPercentages[i].percentage);
            }
            return percentages;
        }
    },
    methods: {
        getMaxColums() {
            const column = 6;
            let max_value_colum = Array<number>(column);
            max_value_colum.fill(0);
            for( var food in this.foodNutritions){
                for(let i = 0; i < column; i++){
                    var value = this.foodNutritions[food][i];
                    if(value != undefined){
                        max_value_colum[i] = Math.max(value, max_value_colum[i]);
                    }
                }
            }
            return max_value_colum;
        },
        receiveFooditems(event: any, foodItems: any, totalCount: number) {
            console.log(foodItems);
            if (foodItems !== undefined && foodItems.length != 0) {
                this.foodItems = foodItems;
                this.$emit('returnTotalCount', null, totalCount);
                this.createNutritions();
                this.fetchAllergyInfo();
            }
        },
        async createNutritions() {
            // let ids: Array<string> = new Array<string>();
            // this.foodItems.forEach((row) => {
            //     ids.push(row.id);
            // })
            // console.log(MACRO_NUTRIENTS_FOR_FOODS(ids));
            // console.log(this.foodNutritions);
            this.foodNutritions = {};
            for (let i = 0; i < this.foodItems.length; i++) {
                let result = await dbService.query(MACRO_NUTRIENTS_FOR(this.foodItems[i].id.toString()));
                result = result.rows;
                const naam = this.foodItems[i].naam;
                this.foodNutritions[naam] = this.createNutrition(result);
            }
        },
        createNutrition(result: any): number[] {
            let nutrition: number[] = [];
            nutrition.length = this.nutritionHeaders.length;
            const distincts: DistinctRows = distinctNames(result);
            let i = 0;
            Object.keys(distincts).forEach((key: string) => {
                const values: number[] = distincts[key];
                nutrition[i++] = mean(values);
            });
            return nutrition;
        },
        async fetchAllergyInfo() {
            this.allergiesPerFood = (await dbService.query(GET_ALLERGIES_PER_FOOD_FOR(this.foodItems))).rows;
            this.allergyPercentages = (await dbService.query(COUNT_ALLERGIES_FOR(this.foodItems))).rows;
        },
        setTabIndex(index: number) {
            this.tabIndex=index;
        },
        getAllergiesOfFood(foodName: string) {
            return this.allergiesPerFood?.filter(function(item) { return item.food==foodName;});
        },
        getNutrientPercentages(){
            const column = 6;
            var total = 0;
            let percentage = Array<any>(column);
            percentage.fill(0);
            for( var food in this.foodNutritions){
                for(let i = 0; i < column; i++){
                    var value = this.foodNutritions[food][i];
                    if(value != undefined){
                        percentage[i] += value;
                        total += value;
                    }
                }
            }
            for(let i = 0; i < column; i++){
                percentage[i] = ((percentage[i]/total)*100).toFixed(2);;
            }
            return percentage;
        }
    }
}
</script>
<template>
    <div id="table">
        <!-- tabs -->
        <nav>
            <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-food-tab" data-bs-toggle="tab" data-bs-target="#nav-food"
                    type="button" role="tab" aria-controls="nav-food" aria-selected="true" @click="setTabIndex(0)">Food</button>
                <button class="nav-link" id="nav-nutrition-tab" data-bs-toggle="tab" data-bs-target="#nav-nutrition"
                    type="button" role="tab" aria-controls="nav-nutrition" aria-selected="false" @click="setTabIndex(1)">Nutrition</button>
                <button class="nav-link" id="nav-allergies-tab" data-bs-toggle="tab" data-bs-target="#nav-allergies"
                    type="button" role="tab" aria-controls="nav-allergies" aria-selected="false" @click="setTabIndex(2)">Allergies</button>
                <button class="nav-link" id="nav-recipes-tab" data-bs-toggle="tab" data-bs-target="#nav-recipes"
                    type="button" role="tab" aria-controls="nav-recipes" aria-selected="false" @click="setTabIndex(3)">Recipes</button>
            </div>
        </nav>
        <!-- content -->
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active no-rows" id="nav-food" role="tabpanel" aria-labelledby="nav-food-tab"
                tabindex="0">
                <FoodPicker v-if="data !== undefined" :name="data?.name" :group="data?.group" :subgroup="data?.subgroup"
                    :offset="data?.offset" :allergies="data?.allergies" :pageSize="data?.pageSize" @returnFooditems="receiveFooditems">
                </FoodPicker>
            </div>
            <!-- Nutrients -->
            <div class="tab-pane fade rows" id="nav-nutrition" role="tabpanel" aria-labelledby="nav-nutrition-tab" tabindex="0">
                <table v-if="tabIndex==1" class="table table-hover">
                    <thead>
                        <TableGraph :percentages="getNutrientPercentages()" :columnNames="nutritionHeaders" />
                    </thead>
                    <thead class="table-secondary">
                        <TableRowHead
                            :columnNames="['Name'].concat(nutritionHeaders)" />
                    </thead>
                    <tbody>
                        <div v-if="foodItems.length == 0">
                            <SpinnerComponent></SpinnerComponent>
                        </div>
                        <TableRowNutrition v-bind:key="foodItems[i].id" v-if="Object.keys(foodNutritions).length != 0" v-for="(nutritions, key, i) in foodNutritions"
                            :columnNames="nutritionHeaders" :id="foodItems[i].id" :name="Object.keys(foodNutritions)[i]" :items="nutritions" :max_value="getMaxColums()"/>
                    </tbody>
                </table>
            </div>
            <!-- Allergies -->
            <div class="tab-pane fade rows" id="nav-allergies" role="tabpanel" aria-labelledby="nav-allergies-tab" tabindex="0">
                <table v-if="tabIndex==2" class="table table-hover">
                    <thead>
                        <TableGraph :percentages="getAllergyPercentages" :columnNames="getAllergyNames"/>
                    </thead>
                    <thead class="table-secondary">
                        <TableRowHead :columnNames="['Name'].concat(getAllergyNames)" />
                    </thead>
                    <tbody>
                        <div v-if="foodItems.length == 0">
                            <SpinnerComponent></SpinnerComponent>
                        </div>
                        <TableRowAllergy v-if="foodItems.length != 0" v-for="(food, i) in foodItems"
                            :id="foodItems[i].id" :name="food.naam" :allergyNames="getAllergyNames" :allergies="getAllergiesOfFood(food.naam)" />
                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade no-rows" id="nav-recipes" role="tabpanel" aria-labelledby="nav-recipes-tab" tabindex="0">
                <RecipesList v-if="tabIndex==3" class="mx-auto" id="1"></RecipesList>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "@/../scss/custom.scss";
#table {
    margin-top: 50px;

}

.tab-pane {
    border-style: solid;
    
    border-color: $gray-300;
}

.rows{
    /* top right bottom left */
    border-width: 0px 1px 0px 1px;
}

 .no-rows{
    /* top right bottom left */
    border-width: 0px 1px 1px 1px;
 }
</style>
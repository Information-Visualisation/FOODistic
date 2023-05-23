<script lang="ts">
import TableRowHead from './TableRowHead.vue';
import TableGraph from './TableGraphs.vue';
import TableRowNutrition from './TableRowNutrition.vue';
import TableRowAllergy from './TableRowAllergy.vue';
import FoodPicker from '@/components/FoodPicker.vue';
import TableRecipe from './TableRecipe.vue';
import SpinnerComponent from '../SpinnerComponent.vue';
import { NUTRIENTS_FOR, GET_ALLERGIES_PER_FOOD_FOR, COUNT_ALLERGIES_FOR, COUNT_RECIPE_FOR} from '@/services/queries';
import { DBService, distinctNames } from '@/services/db.service';
import type { DistinctRows, FoodRow, AllergyPercentageRow, FoodAllergyRow, RecipeCount } from '@/services/dbClasses';
import { mean } from '@/services/statistics';
import * as bootstrap from 'bootstrap';

const dbService = new DBService;

type SortRow = {name: string, sort: number|string|boolean};

export default {
    props: {
        foodPickerData: {
            type: Object,
            required: true
        }
    },
    components: {
        TableGraph,
        TableRowHead,
        TableRowNutrition,
        FoodPicker,
        TableRecipe,
        SpinnerComponent,
        TableRowAllergy
    },
    data() {
        return {
            isLoading: true,
            foodItems: [] as FoodRow[],
            foodNutritions: {} as {[key: string]: number[]},
            tabIndex: (this.$route.query.tabIndex ?? 0) as number,
            allergiesPerFood: [] as FoodAllergyRow[],
            allergyPercentages: [] as AllergyPercentageRow[],
            nutritionHeaders: ['Ash', 'Carbohydrate', 'Fat', 'Fatty Acid', 'Fiber', 'Proteins'],
            recipeCount: [] as RecipeCount[],
            recipeLabel: [] as string[],
            foodIds: [] as number[],
            sortedFoodNames: {} as SortRow[],
            foodIDs: {} as {[key: string]: number},
            tabs: ['food', 'nutrition', 'allergies', 'recipes'] // names of the tabs for navigation
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
        },
        getAllergyCount() : number[] {
            let counts = [];
            for (let i = 0; i < this.allergyPercentages.length; ++i) {
                counts.push(this.allergyPercentages[i].count);
            }
            return counts;
        }
    },
    methods: {
        // Returns food names with their id {'food': id}
        getFoodIDs() {
            let foodIDs = {} as {[key: string]: number};
            for (let i = 0; i < this.foodItems.length; ++i) {
                foodIDs[this.foodItems[i].naam] = this.foodItems[i].id;
            }
            return foodIDs;
        },
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
        async receiveFooditems(event: any, foodItems: any, totalCount: number) {
            if (foodItems !== undefined && foodItems.length != 0) {
                this.foodItems = foodItems;
                this.sortedFoodNames = this.getInitialSortedFoodNames(this.foodItems);
                this.$emit('returnTotalCount', null, totalCount);
                this.fetchRecipeInfo();
            }
        },
        getFoodInfo(){
            this.recipeLabel = [];
            this.foodIds = [];
            for(let i = 0; i < this.foodItems.length; i++){
                this.recipeLabel.push(this.foodItems[i].naam);
                this.foodIds.push(this.foodItems[i].id);
            }
            this.createNutritions();
            this.fetchAllergyInfo();
            this.foodIDs = this.getFoodIDs();
        },
        async createNutritions() {
            if (this.tabIndex == 1) {
                this.foodNutritions = {};
                for (let i = 0; i < this.foodItems.length; i++) {
                    const id: string = this.foodItems[i].id.toString();
                    let result = await dbService.query(NUTRIENTS_FOR(id));
                    result = result.rows;
                    const naam = this.foodItems[i].naam;
                    this.foodNutritions[naam] = this.createNutrition(result);
                }
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
            if (this.tabIndex == 2) {
                this.allergiesPerFood = (await dbService.query(GET_ALLERGIES_PER_FOOD_FOR(this.foodItems))).rows;
                this.allergyPercentages = (await dbService.query(COUNT_ALLERGIES_FOR(this.foodItems))).rows;
            }
        },
        async fetchRecipeInfo() {
            this.getFoodInfo();
            if (this.tabIndex == 3) {
                this.isLoading = true;
                this.recipeCount = [];
                const queryString: string = COUNT_RECIPE_FOR(this.foodIds);
                this.recipeCount = (await dbService.query(queryString, false)).rows;
                this.isLoading = false;
            }
        },
        async setTabIndex(index: number) {
            this.$router.push({ // push same route, but append tabindex
                name: this.$route.name ?? 'home',
                params: this.$route.params,
                query: { ...this.$route.query, tabIndex: index}
            });
            this.tabIndex=index;
            this.sortedFoodNames = this.getInitialSortedFoodNames(this.foodItems);
            this.sortNutritions(0, true); // reset sort order of table on change tab
            this.fetchRecipeInfo();
        },
        getAllergiesOfFood(foodName: string): FoodAllergyRow[] {
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
        },
        getInitialSortedFoodNames(foodItems: FoodRow[]): SortRow[] {
            // Create array with [foodName, foodName]
            let sortedFoodNames = Object.keys(foodItems).map(function(key: string, index: number, keys: string[]) {
                return {name: foodItems[index].naam, sort: foodItems[index].naam};
            }) as SortRow[];
            return sortedFoodNames;
        },
        sortNutritions(filterColumn: number, sortDown: boolean) {
            let foodNutritions = this.foodNutritions;
            // Make array of structure [foodname, sortValue]
            this.sortedFoodNames = Object.keys(foodNutritions).map(function(key, index, keys) {
                if (filterColumn == 0) {    // filter by name
                    return {name: key, sort: key};
                } else {                    // filter by nutrition value or allergy
                    return {name: key, sort: foodNutritions[key][filterColumn - 1]};
                }
            }) as SortRow[];
            if (sortDown) {
                this.sortedFoodNames.sort((a: SortRow, b: SortRow) => {
                    if (a.sort == null)
                        return 1;
                    else if (b.sort == null)
                        return -1;
                    else
                        return a.sort < b.sort ? -1 : 1; // sort down
                })
            } else {
                this.sortedFoodNames.sort((a: SortRow, b: SortRow) => {
                    if (a.sort == null)
                        return 1;
                    else if (b.sort == null)
                        return -1;
                    else
                        return b.sort < a.sort ? -1 : 1; // sort up
                })
            }
        },
        sortAllergies(filterColumn: number, sortDown: boolean) {
            function foodHasAllergy(allergiesPerFood: FoodAllergyRow[], foodName: string, allergy: string): boolean {
                for (var row of allergiesPerFood) {
                    if (row.food == foodName && row.allergy == allergy) {
                        return true;
                    }
                }
                return false;
            }
            let allergyNames = this.getAllergyNames;
            let foodItems: FoodRow[] = this.foodItems;
            let allergiesPerFood = this.allergiesPerFood;
            // make map of structure [foodName]
            this.sortedFoodNames = Object.keys(foodItems).map(function(key, index, keys) {
                if (filterColumn == 0) {    // filter by name
                    return {name: foodItems[index].naam, sort: foodItems[index].naam};
                } else {                    // filter by nutrition value or allergy
                    let allergyFilter = allergyNames[filterColumn - 1];
                    let _foodHasAllergy = foodHasAllergy(allergiesPerFood, foodItems[index].naam, allergyFilter);
                    return {name: foodItems[index].naam, sort: _foodHasAllergy};
                }
            });
            if (sortDown) {
                this.sortedFoodNames.sort((a: SortRow, b: SortRow) => {
                    if (a.sort)
                    return -1;
                    else if (b.sort)
                    return 1;
                    else
                    return 0;
                })
            } else {
                this.sortedFoodNames.sort((a: SortRow, b: SortRow) => {
                    if (a.sort)
                    return 1;
                    else if (b.sort)
                    return -1;
                    else
                    return 0;
                })
            }
        },
        
    },
    mounted() {
        // const triggerTabList = document.querySelectorAll('[role="tab"]');
        // triggerTabList.forEach(triggerEl => {
        //     // event listener for changes tabs
        //   triggerEl.addEventListener('click', event => {
        //     console.log('changed tab');
        //   })
        // });

        
        document.getElementById('nav-' + this.tabs[this.tabIndex]+'-tab')?.click(); // open tab that is set in router
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
                <FoodPicker v-if="foodPickerData !== undefined" :name="foodPickerData?.name" :group="foodPickerData?.group" :subgroup="foodPickerData?.subgroup"
                    :offset="foodPickerData?.offset" :allergies="foodPickerData?.allergies" :pageSize="foodPickerData?.pageSize" @returnFooditems="receiveFooditems">
                </FoodPicker>
            </div>
            <!-- Nutrients -->
            <div class="tab-pane fade rows" id="nav-nutrition" role="tabpanel" aria-labelledby="nav-nutrition-tab" tabindex="0">
                <table v-if="tabIndex==1" class="table table-hover">
                    <thead>
                        <TableGraph :percentages="getNutrientPercentages()" :columnNames="nutritionHeaders" />
                    </thead>
                    <thead class="table-secondary">
                        <TableRowHead :columnNames="['Name'].concat(nutritionHeaders)" @sortByColumn="sortNutritions"/>
                    </thead>
                    <tbody>
                        <div v-if="foodItems.length == 0">
                            <SpinnerComponent></SpinnerComponent>
                        </div>
                        <TableRowNutrition v-bind:key="foodIDs[item.name]" v-if="Object.keys(sortedFoodNames).length != 0" v-for="item in sortedFoodNames"
                            :columnNames="nutritionHeaders" :id="foodIDs[item.name]" :name="item.name" :items="foodNutritions[item.name] ?? []" :max_value="getMaxColums()"/>
                    </tbody>
                </table>
            </div>
            <!-- Allergies -->
            <div class="tab-pane fade rows" id="nav-allergies" role="tabpanel" aria-labelledby="nav-allergies-tab" tabindex="0">
                <table v-if="tabIndex==2" class="table table-hover">
                    <thead>
                        <TableGraph :percentages="getAllergyPercentages" :columnNames="getAllergyNames" :counts="getAllergyCount" :totaalFoods="foodItems.length"/>
                    </thead>
                    <thead class="table-secondary">
                        <TableRowHead :columnNames="['Name'].concat(getAllergyNames)"  @sortByColumn="sortAllergies"/>
                    </thead>
                    <tbody>
                        <div v-if="foodItems.length == 0">
                            <SpinnerComponent></SpinnerComponent>
                        </div>
                        <TableRowAllergy v-if="foodItems.length != 0" v-for="item in sortedFoodNames"
                            :id="foodIDs[item.name]" :name="item.name" :allergyNames="getAllergyNames" :allergies="getAllergiesOfFood(item.name)" />
                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade no-rows" id="nav-recipes" role="tabpanel" aria-labelledby="nav-recipes-tab" tabindex="0">
                <div v-if="isLoading">
                            <SpinnerComponent></SpinnerComponent>
                </div>
                <div v-if="!isLoading || recipeCount.length != 0">
                    <TableRecipe v-if="tabIndex==3" class="mx-auto" :foodIds="foodIds" :label="recipeLabel" :recipescount="recipeCount" ></TableRecipe>
                </div>
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
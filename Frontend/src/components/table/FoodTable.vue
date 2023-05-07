<script lang="ts">
import TableRowTemp from './TableRowTemp.vue';
import TableRowHead from './TableRowHead.vue';
import TableGraph from './TableGraphs.vue';
import TableRowNutrition from './TableRowNutrition.vue';
import TableRowAllergy from './TableRowAllergy.vue';
import FoodPicker from '@/components/FoodPicker.vue';
import RecipesList from '@/components/RecipesList.vue';
import SpinnerComponent from '../SpinnerComponent.vue';
import { MACRO_NUTRIENTS_FOR_FOODS, GET_ALLERGIES_FOR, GET_ALLERGIES_PER_FOOD_FOR } from '@/services/queries';
import { DBService, distinctNames, type DistinctRows } from '@/services/db.service';
import { mean } from '@/services/statistics';

const dbService = new DBService;

export default {
    props: {
        data: {
            required: true
        }
    },
    components: {
        TableGraph,
        TableRowHead,
        TableRowNutrition,
        TableRowTemp,
        FoodPicker,
        RecipesList,
        SpinnerComponent,
        TableRowAllergy
    },
    data() {
        return {
            foodItems: [],
            foodNutritions: {} as Object,
            tabIndex: 0,
            allergies: [] as string[],
            allergiesPerFood: [] as Object[],
        }
    },
    created() {
    },
    watch: {
        data(newV, oldV) {
            console.log(newV);
        }
    },
    emits: ["returnTotalCount"],
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
            if (foodItems !== undefined) {
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
            this.foodNutritions = new Object();
            for (let i = 0; i < this.foodItems.length; i++) {
                let result = await dbService.query(MACRO_NUTRIENTS_FOR(this.foodItems[i].id));
                result = result.rows;
                const naam = this.foodItems[i].naam;
                this.foodNutritions[naam] = this.createNutrition(result);
            }
        },
        createNutrition(result: any): Array<Number> {
            const NUTRITIONS_COUNT = 6;
            let nutrition: Array<Number> = new Array<Number>(NUTRITIONS_COUNT);
            const distincts: DistinctRows = distinctNames(result);

            let i = 0;
            Object.keys(distincts).forEach((key: string) => {
                const values: number[] = distincts[key];
                const m = mean(values);
                nutrition[i++] = m;
            });
            return nutrition;
        },
        async fetchAllergyInfo() {
            this.allergiesPerFood = (await dbService.query(GET_ALLERGIES_PER_FOOD_FOR(this.foodItems))).rows;
            // console.log(GET_ALLERGIES_FOR(this.foodItems));
            let allergies = (await dbService.query(GET_ALLERGIES_FOR(this.foodItems))).rows;
            this.allergies = [];
            for (let i = 0; i < allergies.length; ++i) {
                this.allergies.push(allergies[i].allergy);
            }
        },
        setTabIndex(index: number) {
            this.tabIndex=index;
        },
        getAllergiesOfFood(foodName: string) {
            return this.allergiesPerFood?.filter(function(item) {return item.food==foodName;});
        },
        getAllergyPercentages(numColumns: number) {
            let percentage = (100 / numColumns).toFixed(2);
            return Array<string>(numColumns).fill(percentage);
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
            <div class="tab-pane fade show active" id="nav-food" role="tabpanel" aria-labelledby="nav-food-tab"
                tabindex="0">
                <FoodPicker v-if="data !== undefined" :name="data?.name" :group="data?.group" :subgroup="data?.subgroup"
                    :offset="data?.offset" :allergies="data?.allergies" @returnFooditems="receiveFooditems"></FoodPicker>
            </div>
            <div class="tab-pane fade" id="nav-nutrition" role="tabpanel" aria-labelledby="nav-nutrition-tab" tabindex="0">
                <table v-if="tabIndex==1" class="table table-hover">
                    <thead>
                        <TableGraph :percentages="getNutrientPercentages()" />
                    </thead>
                    <thead class="table-secondary">
                        <TableRowHead
                            :columnNames="['Name', 'Ash', 'Carbohydrate', 'Fat', 'Fatty Acid', 'Fiber', 'Proteins']" />
                    </thead>
                    <tbody>
                        <div v-if="foodItems.length == 0">
                            <SpinnerComponent></SpinnerComponent>
                        </div>
                        <TableRowNutrition v-if="foodNutritions.length != 0" v-for="(nutritions, name, i) in foodNutritions"
                            :id="foodItems[i].id" :name="name" :items="nutritions" :max_value="getMaxColums()"/>
                        <!--<TableRowTemp v-for="items in test_items" :items='items'/>-->
                        <!-- change to foods and nutrition values-->
                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade" id="nav-allergies" role="tabpanel" aria-labelledby="nav-allergies-tab" tabindex="0">
                <table v-if="tabIndex==2" class="table table-hover">
                    <thead>
                        <TableGraph :percentages="getAllergyPercentages(allergies.length)" />
                    </thead>
                    <thead class="table-secondary">
                        <TableRowHead
                            :columnNames="['Name'].concat(allergies)" />
                    </thead>
                    <tbody>
                        <div v-if="foodItems.length == 0">
                            <SpinnerComponent></SpinnerComponent>
                        </div>
                        <TableRowAllergy v-if="foodNutritions.length != 0" v-for="(nutritions, name, i) in foodNutritions"
                            :id="foodItems[i].id" :name="name" :allergyColumns="allergies" :allergies="getAllergiesOfFood(name)" />
                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade" id="nav-recipes" role="tabpanel" aria-labelledby="nav-recipes-tab" tabindex="0">
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
    /* top right bottom left */
    border-width: 0px 1px 0px 1px;
    border-color: $gray-300;
}
</style>
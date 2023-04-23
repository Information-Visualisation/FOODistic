<script lang="ts">
import TableRowTemp from './TableRowTemp.vue';
import TableRowHead from './TableRowHead.vue';
import TableGraph from './TableGraphs.vue';
import TableRowNutrition from './TableRowNutrition.vue';
import FoodPicker from '@/components/FoodPicker.vue';
import RecipesList from '@/components/RecipesList.vue';
import SpinnerComponent from '../SpinnerComponent.vue';
import { MACRO_NUTRIENTS_FOR } from '@/services/queries';
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
        SpinnerComponent
    },
    data() {
        return {
            foodItems: [],
            foodNutritions: {} as Object
        }
    },
    created() {

    },
    watch: {
        data(newV, oldV) {
            console.log(newV);
        }
    },
    methods: {
        getMaxColums() {
            let max_value_colum = [] as number[];
            let colums = this.test_items[0].length;
            for (let i = 1; i < this.test_items[0].length; i++) {
                max_value_colum.push(this.test_items[0][i] as number);
            }
            for (let i = 1; i < this.test_items.length; i++) {
                for (let j = 1; j < colums; j++) {
                    max_value_colum[j - 1] = Math.max(this.test_items[i][j] as number, max_value_colum[j - 1]);
                }
            }
            return max_value_colum;
        },
        receiveFooditems(event: any, fooditems: any) {
            console.log(fooditems);
            this.foodItems = fooditems;
            this.createNutritions();
        },
        async createNutritions() {
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
                    type="button" role="tab" aria-controls="nav-food" aria-selected="true">Food</button>
                <button class="nav-link" id="nav-nutrition-tab" data-bs-toggle="tab" data-bs-target="#nav-nutrition"
                    type="button" role="tab" aria-controls="nav-nutrition" aria-selected="false">Nutrition</button>
                <button class="nav-link" id="nav-allergies-tab" data-bs-toggle="tab" data-bs-target="#nav-allergies"
                    type="button" role="tab" aria-controls="nav-allergies" aria-selected="false">Allergies</button>
                <button class="nav-link" id="nav-recipes-tab" data-bs-toggle="tab" data-bs-target="#nav-recipes"
                    type="button" role="tab" aria-controls="nav-recipes" aria-selected="false">Recipes</button>
            </div>
        </nav>
        <!-- content -->
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-food" role="tabpanel" aria-labelledby="nav-food-tab"
                tabindex="0">
                <FoodPicker v-if="data !== undefined" :name="data.name" :group="data.group" :subgroup="data.subgroup"
                    :offset="data.offset" :allergies="data.allergies" @returnFooditems="receiveFooditems"></FoodPicker>
            </div>
            <div class="tab-pane fade" id="nav-nutrition" role="tabpanel" aria-labelledby="nav-nutrition-tab" tabindex="0">
                <table class="table table-hover">
                    <thead>
                        <TableGraph :percentages="[70, 15, 15]" />
                    </thead>
                    <thead class="table-secondary">
                        <TableRowHead :columnNames="['Name', 'Ash', 'Carbohydrate', 'Fat', 'Fatty Acid', 'Fiber', 'Proteins']" />
                    </thead>
                    <tbody>
                        <div v-if="foodItems.length == 0">
                            <SpinnerComponent></SpinnerComponent>
                        </div>
                        <TableRowNutrition v-if="foodNutritions.length != 0" v-for="(nutritions, name, i) in foodNutritions" :id="foodItems[i].id" :name="name" :items="nutritions" />
                        <!--<TableRowTemp v-for="items in test_items" :items='items'/>-->
                        <!-- change to foods and nutrition values-->
                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade" id="nav-allergies" role="tabpanel" aria-labelledby="nav-allergies-tab" tabindex="0">
                Allergies</div>
            <div class="tab-pane fade" id="nav-recipes" role="tabpanel" aria-labelledby="nav-recipes-tab" tabindex="0">
                <RecipesList class="mx-auto" id="1"></RecipesList>
            </div>
        </div>
    </div>
</template>

<style>
#table {
    /* background-color: rgb(208, 208, 208); */
    margin: 5%;

}

.tab-pane {
    border-style: solid;
    border-width: 0px 1px 0px 1px;
    /* top right bottom left */
    border-color: #dee2e6;
    /* tried var(--bs-nav-tabs-link-active-border-color) but didn't work */
}
</style>
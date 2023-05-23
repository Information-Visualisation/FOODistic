<script lang="ts">
import { DBService, nutrientsRecipeDB } from '../services/db.service'
import type { RecipesRow, DatasetRecipeRow, CombinedRecipes, FoodRow } from '../services/dbClasses';
import SpinnerComponent from './SpinnerComponent.vue';
import RecipeItem from '../components/RecipeItem.vue';
import NutrientGraphRecipe from './NutrientGraphRecipe.vue';
import { GET_FOOD_FOR_ID, GET_RECIPES_FOR } from '../services/queries';
import { Bar, Bubble } from 'vue-chartjs';
import { techniqueStrings } from '@/services/cookingtechniques';
import { getTechniqueCounts } from '@/services/cookingtechniques';
import { capitalize } from 'vue';
import { foodColors, nutrientColors } from '@/services/colors';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'

const dbService = new DBService;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const defaultColorForNutrient = '#FF6384';
const labels = nutrientsRecipeDB;

export default {
    name: 'NutrientGraph',
    components: {
        NutrientGraphRecipe,
        SpinnerComponent,
        RecipeItem,
        Bar,
        Bubble,
    },
    props: {
        ids: {
            type: Array<String>,
            required: true
        },
        focusedDataset: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            isLoading: true,
            isFiltering: false,
            recipesPerFood: [] as Array<{ [key: number]: RecipesRow }>,
            selectedRecipeIndex: -1 as number,
            filteredRecipes: [] as Array<{ [key: number]: RecipesRow }>,
            combined: { ofFoods: [], combinedRecipes: [] } as CombinedRecipes,
            doneCombining: false,
            image: new Image(20, 20),
            nutrients: labels,
            selectedNutrient: 'Fat',
            isAverage: false,
            factor: 1.5,
            noData: false,
            noDataFor: [] as Array<String>,
            data: {
                labels: techniqueStrings,
                datasets: [] as Array<DatasetRecipeRow>
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                fill: {
                    opacity: 0.8,
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Technique Count'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Cooking Techniques'
                        },
                        ticks: {
                            stepSize: 1,
                            callback: function (value: any, index: number, values: any) {
                                return techniqueStrings[value];
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        display: false
                    },
                    tooltip: {
                        usePointStyle: true,
                        boxPadding: 10,
                        padding: 10,
                        bodyFont: {
                            weight: 'bold',
                        },
                        callbacks: {
                            labelPointStyle: (context: any) => {
                                // @ts-ignore --> ignore error that is not an error
                                this.image.src = '/src/assets/cookingtechniques/' + context.label + '.png'
                                return {
                                    pointStyle: this.image
                                }
                            },
                            footer: (context: any) => {
                                return this.selectedNutrient + (this.isAverage ? ' average' : '') + ': ' + Number.parseFloat(this.decompress(context[0].raw.r)).toFixed(2) + '% of daily value';
                            },
                            title: (context: any) => {
                                return '';  // to remove default title
                            },
                            label: (context: any) => {
                                return capitalize(context.label);
                            }
                        }
                    },
                }
            },
        }
    },
    async created() {
        for (let i = 0; i < this.ids.length; i++) {
            await this.fetchData(i, this.ids[i] as string);
        }
        this.selectNutrient(this.selectedNutrient);

        this.combineRecipes();
    },
    methods: {
        async fetchData(foodIndex: number, id: string) {
            const queryString: string = GET_RECIPES_FOR(id);
            this.recipesPerFood.push((await dbService.query(queryString, false)).rows);

            this.filteredRecipes = this.recipesPerFood;
            this.$nextTick(() => {
                this.loaded();
            })
        },
        loaded() {
            this.isLoading = false;
        },
        selectNutrient(nutrient: string) {
            this.selectedNutrient = nutrient;
            for (let foodIndex: number = 0; foodIndex < this.filteredRecipes.length; foodIndex++) {
                this.fillGraph(foodIndex, this.nutrients.indexOf(nutrient) + 1);
            }
        },
        fillGraph(foodIndex: number, indexNutrient: number) {
            if (Object.keys(this.filteredRecipes[foodIndex]).length <= 0) {
                this.setNoData(foodIndex);
            } else {
                this.data.datasets.push({
                    label: techniqueStrings,
                    fill: false,
                    borderColor: defaultColorForNutrient,
                    backgroundColor: defaultColorForNutrient + '80', //sets opacity to 50% in hex
                    data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    hidden: this.focusedDataset == -1 ? false : foodIndex != this.focusedDataset,
                });

                this.isFiltering = true;
                //this.data.datasets[0].data = [{x: 10, y: 30, r: 15},{x: 20, y: 20,r: 10},{x: 15,y: 8,r: 30}];
                let techniqueCount: Array<Number> = getTechniqueCounts(this.filteredRecipes[foodIndex]);
                const color: string = this.ids.length <= 1 ? this.getNutrientColor() : this.getColorForFood(foodIndex);
                this.data.datasets[foodIndex].borderColor = color;
                this.data.datasets[foodIndex].backgroundColor = color + '80';
                for (let techniqueIndex = 0; techniqueIndex < techniqueCount.length; techniqueIndex++) {
                    this.data.datasets[foodIndex].data[techniqueIndex] = { x: techniqueIndex, y: techniqueCount[techniqueIndex], r: this.getNutrientForTechniques(foodIndex, techniqueIndex, indexNutrient) };
                }
                this.$nextTick(() => {
                    this.isFiltering = false;
                });
            }
        },
        compress(value: number): number {
            //value / this.factor
            return Math.log(value) / Math.log(this.factor);
        },
        decompress(value: number): number {
            //value * this.factor
            return Math.pow(value, this.factor);
        },
        getNutrientForTechniques(foodIndex: number, techniqueIndex: number, nutrientIndex: number, getLog: boolean = true): number {
            let nutrient = 0;
            let totalCount = 0;
            //Don't change this length to object keys. it doens't work otherwise :P
            for (let j = 0; j < this.filteredRecipes[foodIndex].length; j++) {
                const hasTechnique = this.filteredRecipes[foodIndex][j].techniques[techniqueIndex]
                if (hasTechnique) {
                    nutrient += this.filteredRecipes[foodIndex][j].nutritions[nutrientIndex];
                    totalCount++;
                }
            }

            if (this.isAverage) {
                nutrient = nutrient / totalCount;
            }

            if (getLog) {
                let resultMath = this.compress(nutrient);
                if (resultMath.toString() == "-Infinity") {
                    return 0;
                }
                else {
                    return resultMath;
                }
            }
            return nutrient;

        },
        showOneRecipe(recipeIndex: number, showOne: boolean) {
            if (showOne) {
                this.selectedRecipeIndex = recipeIndex;
            } else {
                this.selectedRecipeIndex = -1;
            }
            this.updateFilters();
        },
        updateFilters() {
            if (this.selectedRecipeIndex == -1) {
                this.filteredRecipes = this.recipesPerFood;
            } else {
                this.filteredRecipes = [[this.combined.combinedRecipes[this.selectedRecipeIndex]]];
            }

            this.selectNutrient(this.selectedNutrient);
        },
        toggleAverage() {
            this.isAverage = !this.isAverage;
            this.updateFilters();
        },
        combineRecipes() {
            this.doneCombining = false;
            let combining: CombinedRecipes = { ofFoods: [], combinedRecipes: [] };

            combining.combinedRecipes = [...new Set(Object.values(this.recipesPerFood).map(Object.values).flat())];

            for (let recipeIndex = 0; recipeIndex < combining.combinedRecipes.length; recipeIndex++) {
                const recipe: RecipesRow = combining.combinedRecipes[recipeIndex];
                combining.ofFoods.push(this.getOfFood(recipe));
            }

            this.combined = combining;
            this.doneCombining = true;
        },
        getOfFood(recipe: RecipesRow): Array<String> {
            let idList: Array<String> = [];
            for (let recipes of this.recipesPerFood) {
                for (let foodid of this.ids) {
                    if (Object.values(recipes).some(e => e.foodid.toString() === foodid && e.recipeid == recipe.recipeid)) {
                        idList.push(foodid);
                        // console.log(foodid);
                    }
                }
            }
            return idList;
        },
        async setNoData(foodIndex: number) {
            this.noData = true;
            this.data.datasets.push({
                label: ['No Data'],
                fill: false,
                borderColor: defaultColorForNutrient,
                backgroundColor: defaultColorForNutrient + '80', //sets opacity to 50% in hex
                data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                hidden: this.focusedDataset == -1 ? false : foodIndex != this.focusedDataset,
            } as DatasetRecipeRow);
            const foodData: FoodRow = (await dbService.query(GET_FOOD_FOR_ID(this.ids[foodIndex] as string))).rows[0];
            this.noDataFor.push(foodData.naam as string);
        },
        getNutrientColor(): string {
            let color: string = nutrientColors[this.selectedNutrient];
            if (color === undefined) {
                color = defaultColorForNutrient;
            }
            this.setCSSNutrientColor(color);
            return color;
        },
        getColorForFood(i: number): string {
            return foodColors['food' + (i + 1).toString()];
        },
        setCSSNutrientColor(hex: string) {
            let root = document.documentElement;
            root.style.setProperty('--nutrient-color', hex);
        },
        getFoodColorNum(recipeIndex: number): Array<Number> {
            return this.combined.ofFoods[recipeIndex].map((element) => this.ids.indexOf(element) + 1);
        },
        onlyUnique(value: any, index: number, array: Array<any>) {
            return array.indexOf(value) === index;
        }
    },
    watch: {
        focusedDataset(n, o) {
            this.data.datasets = [];
            this.updateFilters();
            // if (!this.isLoading) {
            //     this.isLoading = true
            //     for (let i = 0; i < this.data.datasets.length; i++) {
            //         let data = this.data.datasets[i];
            //         data.hidden = this.focusedDataset == -1 ? false : i != this.focusedDataset;
            //     }
            // }
            // this.loaded();
        }
    }
}
</script>

<template>
    <div style="width: 640px;">
        <div class="position-relative">
            <h3 class="headerShrink">Recipe List</h3>
            <div class="position-absolute controls d-flex">
                <div v-if="noData" class="alert alert-warning noData" role="alert">No data for {{ noDataFor.filter(onlyUnique).join(',') }}
                </div>
                <div v-if="!isLoading && selectedRecipeIndex == -1" class="form-check form-switch toggle">
                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
                        @click="toggleAverage">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Average</label>
                </div>
                <div v-if="!isLoading" class="btn-group">
                    <button type="button" class="btn-outline-custom btn dropdown-toggle" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        {{ selectedNutrient }}
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="nutrient in nutrients">
                            <p class="dropdown-item" @click="selectNutrient(nutrient.toString())">{{ nutrient }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div>
            <div v-if="isLoading" class="position-relative">
                <SpinnerComponent class="position-absolute spinner" />
                <Bar :data="data" :options="options" style="min-height: 353px; width: 640px;" />
            </div>
            <div v-if="!isLoading" class="position-relative">
                <div v-if="Object.keys(recipesPerFood).length <= 0" class="position-absolute alert alert-dark noData"
                    role="alert">
                    No cooking
                    techniques found
                </div>
                <div v-if="Object.keys(filteredRecipes[0]).length == 1" style="min-height: 353px; width: 640px;">
                    <NutrientGraphRecipe :id="filteredRecipes[0][0].recipeid"></NutrientGraphRecipe>
                </div>
                <div v-if="Object.keys(filteredRecipes[0]).length > 1" style="min-height: 353px; width: 640px;">
                    <Bubble v-if="!isFiltering" :data="data" :options="options" />
                </div>
            </div>
        </div>
        <div v-if="isLoading" class="position-relative scrollview">
            <SpinnerComponent class="position-absolute center-spinner" />
        </div>
        <div v-if="!isLoading" class="container overflow-auto scrollview border rounded">
            <div v-if="Object.keys(recipesPerFood).length <= 0"
                class="position-absolute top-50 start-50 translate-middle alert alert-dark" role="alert">No recipes found
            </div>
            <ul class="list-group">
                <li ref="filtered" class="list-group-item disabled" :aria-current="false">
                    <div v-if="isLoading">
                        <SpinnerComponent class="mx-auto p-2" />
                    </div>
                    <div class="position-relative hoverCursor">
                        <div class="row">
                            <div class="col text-start">Recipe Name</div>
                            <div class="col">Food</div>
                            <div class="col text-end">Cooking Techniques</div>
                        </div>
                    </div>
                </li>
                <RecipeItem v-if="doneCombining" v-for="(recipe, index) in combined.combinedRecipes"
                    :recipeName="recipe.recipename" :techniques="recipe.techniques" :ofFoods="getFoodColorNum(index)"
                    @mouseenter="showOneRecipe(index, true)" @mouseleave="showOneRecipe(index, false)"
                    @click="$router.push({ name: 'recipe', query: { id: recipe.recipeid } })">
                </RecipeItem>
            </ul>
        </div>
        <div class="collapse" id="collapseExample">
            idk
        </div>
    </div>
</template>

<style>
.center-spinner {
    top: 90px;
    left: 230px
}

.scrollview {
    height: 289px;
}

.controls {
    top: 5px;
    right: 35px;
}

.toggle {
    margin-top: 6px;
    margin-right: 10px;
}

.averageToggle {
    top: 12px;
    right: 120px;
}

.headerShrink {
    top: 0px;
    left: 0px;
    width: 300px;
}

.btn-outline-custom {
    --bs-btn-color: var(--nutrient-color);
    --bs-btn-border-color: var(--nutrient-color);
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: var(--nutrient-color);
    --bs-btn-hover-border-color: var(--nutrient-color);
    --bs-btn-focus-shadow-rgb: 220, 53, 69;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: var(--nutrient-color);
    --bs-btn-active-border-color: var(--nutrient-color);
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: var(--nutrient-color);
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: var(--nutrient-color);
    --bs-gradient: none;
}
</style>
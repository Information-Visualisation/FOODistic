<script lang="ts">

import { DBService, nutrientsRecipeDB } from '../services/db.service'
import type { RecipesRow } from '../services/dbClasses';
import SpinnerComponent from './SpinnerComponent.vue';
import RecipeItem from '../components/RecipeItem.vue';
import NutrientGraphRecipe from './NutrientGraphRecipe.vue';
import { GET_RECIPES_FOR } from '../services/queries';
import { Bar, Bubble } from 'vue-chartjs';
import { techniqueStrings } from '@/services/cookingtechniques';
import { getTechniqueCounts } from '@/services/cookingtechniques';
import { capitalize } from 'vue';
import { nutrientColors } from '@/services/colors';

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
        }
    },
    data() {
        return {
            isLoading: true,
            isFiltering: false,
            recipes: [] as Array<{ [key: number]: RecipesRow }>,
            selectedRecipe: null as unknown as number,
            filteredRecipes: {} as { [key: number]: RecipesRow },
            image: new Image(20, 20),
            nutrients: labels,
            selectedNutrient: 'Fat',
            data: {
                labels: techniqueStrings,
                datasets: [{
                    labels: techniqueStrings,
                    fill: false,
                    borderColor: defaultColorForNutrient,
                    backgroundColor: defaultColorForNutrient + '80', //sets opacity to 50% in hex
                    data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                }]
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
                            text: ''
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
                                return this.selectedNutrient + ': ' + Math.round(context[0].raw.r * 100) / 100;
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
    created() {
        for (let i = 0; i < this.ids.length; i++) {
            this.fetchData(this.ids[i] as string);
        }
        let temp = Array(58);
        temp.fill(10);

        //this.data.datasets[1].data = temp;
    },
    methods: {
        async fetchData(id: string) {
            const queryString: string = GET_RECIPES_FOR(id);
            // console.log(queryString);
            this.recipes = (await dbService.query(queryString, false)).rows;
            // console.log('done loading recipes');

            this.filteredRecipes = this.recipes[0];
            this.selectNutrient(this.selectedNutrient);
            this.$nextTick(() => {
                this.loaded();
            })
        },
        loaded() {
            this.isLoading = false;
        },
        fillGraph(indexNutrient: number) {
            this.isFiltering = true;
            //this.data.datasets[0].data = [{x: 10, y: 30, r: 15},{x: 20, y: 20,r: 10},{x: 15,y: 8,r: 30}];
            let techniqueCount: Array<number> = getTechniqueCounts(this.filteredRecipes);
            const color: string = this.getNutrientColor();
            this.data.datasets[0].borderColor = color;
            this.data.datasets[0].backgroundColor = color + '80';
            for (let i = 0; i < techniqueCount.length; i++) {
                this.data.datasets[0].data[i] = { x: i, y: techniqueCount[i], r: this.getNutrients(i, indexNutrient) };
            }
            this.$nextTick(() => {
                this.isFiltering = false;
            })
        },
        getBaseLog(x: number, y: number) {
            return Math.log(y) / Math.log(x);
        },
        getNutrients(index: number, indexNutrient: number) {
            let nutrient = 0;
            for (let i = 0; i < Object.keys(this.filteredRecipes).length; i++) {
                if (this.filteredRecipes[i].techniques[index]) {
                    nutrient += this.filteredRecipes[i].nutritions[indexNutrient];
                }
            }
            let resultMath = this.getBaseLog(1.5, nutrient);
            if (resultMath.toString() == "-Infinity") {
                return 0;
            }
            else {
                return resultMath;
            }

        },
        checkedRecipe(index: number, checked: boolean) {
            if (checked) {
                this.selectedRecipe = index;
            } else {
                this.selectedRecipe = null as unknown as number;
            }
            this.updateFilters(!checked);
        },
        updateFilters(all: boolean) {
            if (all) {
                this.filteredRecipes = this.recipes;
            } else {
                this.filteredRecipes = [this.recipes[this.selectedRecipe]];
            }

            this.selectNutrient(this.selectedNutrient);
        },
        selectNutrient(nutrient: string) {
            this.selectedNutrient = nutrient;
            this.fillGraph(this.nutrients.indexOf(nutrient) + 1);
        },
        getNutrientColor(): string {
            let color: string = nutrientColors[this.selectedNutrient];
            if (color === undefined) {
                color = defaultColorForNutrient;
            }
            this.setCSSNutrientColor(color);
            return color;
        },
        setCSSNutrientColor(hex: string) {
            let root = document.documentElement;
            root.style.setProperty('--nutrient-color', hex);
        }
    }
}
</script>

<template>
    <div style="min-height: 353px; width: 640px;">
        <div class="position-relative">
            <h3 class="headerShrink">Recipe List</h3>
            <div class="position-absolute nutrientPicker">
                <div v-if="!isLoading && Object.keys(filteredRecipes).length != 1" class="btn-group">
                    <button type="button" class="btn-outline-custom btn dropdown-toggle" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        {{ selectedNutrient }}
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="nutrient in nutrients">
                            <p class="dropdown-item" @click="selectNutrient(nutrient)">{{ nutrient }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div>
            <div v-if="isLoading" class="position-relative">
                <SpinnerComponent class="position-absolute spinner" />
                <Bar :data="data" :options="options" />
            </div>
            <div v-else="!isLoading" class="position-relative">
                <div v-if="Object.keys(recipes).length <= 0" class="position-absolute alert alert-dark noData" role="alert">
                    No cooking
                    techniques found
                </div>
                <div v-if="Object.keys(filteredRecipes).length == 1">
                    <NutrientGraphRecipe :id="filteredRecipes[0].recipeid"></NutrientGraphRecipe>
                </div>
                <div v-if="Object.keys(filteredRecipes).length != 1">
                    <Bubble v-if="!isFiltering" :data="data" :options="options" />
                </div>
            </div>
        </div>
        <div v-if="isLoading" class="position-relative scrollview">
            <SpinnerComponent class="position-absolute center-spinner" />
        </div>
        <div v-if="!isLoading" class="container overflow-auto scrollview border rounded">
            <div v-if="Object.keys(recipes).length <= 0"
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
                <RecipeItem v-for="(recipe, index) in recipes" :recipeName=recipe.recipename :techniques=recipe.techniques :ofFoods=""
                    @mouseenter="checkedRecipe(index, true)" @mouseleave="checkedRecipe(index, false)"
                    @click="$router.push({ name: 'recipe', query: { id: recipe.recipeid } })">
                    <!-- checked aanpassen naar hover + click go to recipes -->
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

canvas {
    width: 600px !important;
    height: 300px !important;
}

.nutrientPicker {
    top: 5px;
    right: 35px;
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
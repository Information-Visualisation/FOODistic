<script lang="ts">

import { DBService } from '../services/db.service'
import type { RecipesRow } from '../services/dbClasses';
import SpinnerComponent from './SpinnerComponent.vue';
import RecipeItem from '../components/RecipeItem.vue';
import NutrientGraphRecipe from './NutrientGraphRecipe.vue';
import { GET_RECIPES_FOR } from '../services/queries';
import { Bar, Bubble } from 'vue-chartjs';
import { techniqueStrings } from '@/services/cookingtechniques';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { getTechniqueCounts } from '@/services/cookingtechniques';
import { capitalize } from 'vue';

const dbService = new DBService;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isLoading: true,
            isFiltering: false,
            recipes: {} as {[key: number]: RecipesRow},
            selectedRecipe: null as unknown as number,
            filteredRecipes: {} as {[key: number]: RecipesRow},
            image: new Image(20, 20),
            nutrients: ['Total fat', 'Sugar', 'Sodium', 'Protein', 'Saturated fat', 'Carbohydrates'],
            selectedNutrient: 'Total fat',
            data: {
                labels: techniqueStrings,
                datasets: [{
                    labels: techniqueStrings,
                    fill: false,
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor:"rgba(255, 99, 132, 0.5)",
                    data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},  {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
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
                            callback: function(value: number, index, values){
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
                                return this.selectedNutrient+': ' + Math.round(context[0].raw.r * 100) / 100;
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
        this.fetchData();
        let temp = Array(58);
        temp.fill(10);

        //this.data.datasets[1].data = temp;
    },
    methods: {
        async fetchData() {
            const queryString: string = GET_RECIPES_FOR(this.id);
            // console.log(queryString);
            this.recipes = (await dbService.query(queryString, false)).rows;
            // console.log('done loading recipes');

            this.filteredRecipes = this.recipes;
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
            for(let i = 0; i < techniqueCount.length; i++){
                this.data.datasets[0].data[i] = {x: i, y: techniqueCount[i], r: this.getNutrients(i, indexNutrient)};
            }
            this.$nextTick(() => {
                this.isFiltering = false;
            })
        },
        getBaseLog(x: number, y: number) {
            return Math.log(y) / Math.log(x);
        },
        getNutrients(index: number, indexNutrient: number){
            let nutrient = 0;
            for(let i = 0; i < Object.keys(this.filteredRecipes).length; i++){
                if(this.filteredRecipes[i].techniques[index]) {
                    nutrient += this.filteredRecipes[i].nutritions[indexNutrient];
                }
            }
            let resultMath = this.getBaseLog(1.5,nutrient);
            if(resultMath.toString() == "-Infinity"){
                return 0;
            }
            else{
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
        selectNutrient(nutrient: string){
            this.selectedNutrient = nutrient;
            this.fillGraph(this.nutrients.indexOf(nutrient)+1);
        }
    }
}
</script>

<template>
    <div style="min-height: 353px; width: 640px;">
        <h3>Recipe List</h3>
        <div v-if="!isLoading && Object.keys(filteredRecipes).length != 1" class="btn-group">
            <button type="button" class="btn btn-outline-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              {{ selectedNutrient }}
            </button>
            <ul class="dropdown-menu">
                  <li v-for="nutrient in nutrients">
                        <p class="dropdown-item" @click="selectNutrient(nutrient)">{{ nutrient}}</p>
                  </li>
            </ul>
        </div>
        <div>
            <div v-if="isLoading" class="position-relative">
                <SpinnerComponent class="position-absolute spinner" />
                <Bar :data="data" :options="options" />
            </div>
            <div v-else="!isLoading" class="position-relative">
                <div v-if="Object.keys(recipes).length <= 0" class="position-absolute alert alert-dark noData" role="alert">No cooking
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
            <div v-if="Object.keys(recipes).length <= 0" class="position-absolute top-50 start-50 translate-middle alert alert-dark"
                role="alert">No recipes found</div>
            <ul class="list-group">
                <RecipeItem v-for="(recipe, index) in recipes" :recipeName=recipe.recipename :techniques=recipe.techniques
                    @mouseenter="checkedRecipe(index, true)" @mouseleave="checkedRecipe(index, false)" @click="$router.push({ name: 'recipe', query: { id: recipe.recipeid }})"> <!-- checked aanpassen naar hover + click go to recipes -->
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
</style>
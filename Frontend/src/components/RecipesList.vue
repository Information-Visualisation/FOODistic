<script lang="ts">

import { DBService } from '../services/db.service'
import type { Rows } from '../services/db.service';
import SpinnerComponent from './SpinnerComponent.vue';
import RecipeItem from '../components/RecipeItem.vue';
import { GET_RECIPES_FOR } from '../services/queries';
import { Bar } from 'vue-chartjs';

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
import { primary, secondary } from '@/services/colors';

const dbService = new DBService;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    name: 'NutrientGraph',
    components: {
        SpinnerComponent,
        RecipeItem,
        Bar,
    },
    props: {
        id: {
            type: Array<String>,
            required: true
        }
    },
    data() {
        return {
            isLoading: true,
            isFiltering: false,
            recipes: null,
            filters: [] as Array<string>,
            filteredRecipes: null,
            image: new Image(20, 20),
            data: {
                labels: ['bake', 'barbecue', 'blanch', 'blend', 'boil', 'braise', 'brine', 'broil', 'caramelize', 'combine', 'crock pot', 'crush', 'deglaze', 'devein', 'dice', 'distill', 'drain', 'emulsify', 'ferment', 'freeze', 'fry', 'grate', 'griddle', 'grill', 'knead', 'leaven', 'marinate', 'mash', 'melt', 'microwave', 'parboil', 'pickle', 'poach', 'pour', 'pressure cook', 'puree', 'refrigerate', 'roast', 'saute', 'scald', 'scramble', 'shred', 'simmer', 'skillet', 'slow cook', 'smoke', 'smooth', 'soak', 'sous-vide', 'steam', 'stew', 'strain', 'tenderize', 'thicken', 'toast', 'toss', 'whip', 'whisk'],
                datasets: [{
                    labels: ' ',
                    backgroundColor: primary,
                    pointRadius: 10,
                    pointStyle: this.image,
                    data: [],
                    barPercentage: 1.0,
                    categoryPercentage: 1.0
                },
                {
                    labels: ' ',
                    backgroundColor: secondary,
                    pointRadius: 10,
                    pointStyle: this.image,
                    data: [],
                    barPercentage: 1.0,
                    categoryPercentage: 1.0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        display: false
                    },
                    tooltip: {
                        usePointStyle: true,
                        callbacks: {
                            labelPointStyle: (context: any) => {
                                this.image.src = '/src/assets/cookingtechniques/' + context.label + '.png'
                                return {
                                    pointStyle: this.image
                                }
                            }
                            //footer: this.footer,
                        }
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                    }
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
            this.recipes = await dbService.query(queryString, false);
            this.recipes = this.recipes.rows;
            this.filteredRecipes = this.recipes;
            this.fillGraph();
            this.$nextTick(() => {
                this.loaded();
            })
        },
        loaded() {
            this.isLoading = false;
        },
        fillGraph() {
            this.isFiltering = true;
            this.data.datasets[0].data = getTechniqueCounts(this.filteredRecipes);
            // console.log(getTechniqueCounts(this.filteredRecipes));
            this.$nextTick(() => {
                this.isFiltering = false;
            })
        },
        checkedRecipe(recipeName: string, checked: boolean) {
            if (checked) {
                this.filters.push(recipeName);
            } else {
                this.filters = this.filters.filter(name => name !== recipeName);
            }
            this.updateFilters(this.filters.length == 0);
        },
        updateFilters(all: boolean) {
            if (all) {
                this.filteredRecipes = this.recipes;
            } else {
                this.filteredRecipes = this.recipes.filter((recipe: any) => {
                    for (let i = 0; i < this.filters.length; i++) {
                        if (recipe.recipename === this.filters[i]) {
                            return true;
                        }
                    }
                    return false;
                });
            }

            this.fillGraph()
        }
    }
}
</script>

<template>
    <div style="min-height: 353px; width: 640px;">
        <h3>Recipe List</h3>
        <div>
            <div v-if="isLoading" class="position-relative">
                <SpinnerComponent class="position-absolute spinner" />
                <Bar :data="data" :options="options" />
            </div>
            <div v-else="!isLoading" class="position-relative">
                <div v-if="recipes.length <= 0" class="position-absolute alert alert-dark noData" role="alert">No cooking
                    techniques found
                </div>
                <Bar v-if="!isFiltering" :data="data" :options="options" />
            </div>
            <div class="collapse" id="collapseExample">
                Some placeholder content for the collapse component. This panel is hidden by default but revealed when the
                user activates the relevant trigger.
            </div>
        </div>
        <div v-if="isLoading" class="position-relative scrollview">
            <SpinnerComponent class="position-absolute center-spinner" />
        </div>
        <div v-if="!isLoading" class="container overflow-auto scrollview border rounded">
            <div v-if="recipes.length <= 0" class="position-absolute top-50 start-50 translate-middle alert alert-dark"
                role="alert">No recipes found</div>
            <ul class="list-group">
                <RecipeItem v-for="recipe in recipes" :recipeName=recipe.recipename :techniques=recipe.techniques
                    @mouseenter="checkedRecipe(recipe.recipename, true)" @mouseleave="checkedRecipe(recipe.recipename, false)"> <!-- checked aanpassen naar hover + click go to recipes -->
                </RecipeItem>
            </ul>
        </div>
        <div class="collapse" id="collapseExample">
            Some placeholder content for the collapse component. This panel is hidden by default but revealed when the
            user activates the relevant trigger.
            TODO: Still only shows 100 recipes!
            <ul>
                <li>explain list</li>
                <li>explain icons, here or on about page</li>
            </ul>
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
</style>
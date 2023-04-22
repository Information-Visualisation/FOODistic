<script lang="ts">

import { DBService, avg, distinctNames } from '../services/db.service'
import type { Rows, Row, DistinctRows } from '../services/db.service';
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
            type: String,
            required: true
        }
    },
    data() {
        return {
            isLoading: true,
            recipes: null as unknown as Rows,
            image: new Image(20, 20),
            data: {
                labels: ['bake', 'barbecue', 'blanch', 'blend', 'boil', 'braise', 'brine', 'broil', 'caramelize', 'combine', 'crock pot', 'crush', 'deglaze', 'devein', 'dice', 'distill', 'drain', 'emulsify', 'ferment', 'freeze', 'fry', 'grate', 'griddle', 'grill', 'knead', 'leaven', 'marinate', 'mash', 'melt', 'microwave', 'parboil', 'pickle', 'poach', 'pour', 'pressure cook', 'puree', 'refrigerate', 'roast', 'saute', 'scald', 'scramble', 'shred', 'simmer', 'skillet', 'slow cook', 'smoke', 'smooth', 'soak', 'sous-vide', 'steam', 'stew', 'strain', 'tenderize', 'thicken', 'toast', 'toss', 'whip', 'whisk'],
                datasets: [{
                    labels: ' ',
                    backgroundColor: ["#171819", "#C5AD92", "#7D6D62", "#8bf60b", "#edd5b4", "#d57144"],
                    pointRadius: 10,
                    pointStyle: this.image,
                    data: []
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
                }
            },
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const queryString: string = GET_RECIPES_FOR(this.id);
            this.recipes = await dbService.query(queryString, false);
            this.recipes = this.recipes.rows;
            this.fillGraph();
            this.$nextTick(() => {
                this.loaded();
            })
        },
        loaded() {
            this.isLoading = false;
        },
        fillGraph() {
            this.data.datasets[0].data = getTechniqueCounts(this.recipes);
        },
        // footer(tooltipItems: any) {
        //     let result = ''
        //     tooltipItems.forEach((tooltipItem: any) => {
        //         //result += '<TechniqueIcon :technique="'+this.data.labels[tooltipItem.parsed.x]+'"></TechniqueIcon>'
        //         result += '<img src="https://i.etsystatic.com/18461744/r/il/8cc961/1660161853/il_794xN.1660161853_sohi.jpg" />'
        //     });
        //     return result;
        // }
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
                <Bar :data="data" :options="options" />
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
                <li class="list-group-item" v-for="recipe in recipes">
                    <RecipeItem :title=recipe.recipename :techniques=recipe.techniques></RecipeItem>
                </li>
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
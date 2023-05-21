<script lang="ts">

import { DBService } from '../../services/db.service';
import SpinnerComponent from '../SpinnerComponent.vue';
import RecipeItem from '../../components/RecipeItem.vue';
import { COUNT_RECIPE_FOR } from '../../services/queries';
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
        foodIds: {
            type: [],
            required: true,
        },
        label: {
            type: [],
            required: true,
        },
        recipescount: {
            type: [],
            required: true
        }
    },
    data() {
        return {
            isLoading: true,
            isFiltering: false,
            data: {
                labels: this.label,
                datasets: [{
                    labels: this.label,
                    backgroundColor: '#3A833C',
                    pointRadius: 10,
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
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Count'
                            }
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
        fetchData() {
            console.log(this.recipescount);
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
            this.data.datasets[0].data = this.getRecipeCount();
            this.data.labels = this.label;
            this.$nextTick(() => {
                this.isFiltering = false;
            })
        },
        getRecipeCount(){
            let recipeCount: Array<number> = new Array<number>(this.foodIds.length).fill(0);
            for (let i = 0; i < this.foodIds.length; i++) {
                for(let j = 0; j < this.recipescount.length; j++){
                    if(this.recipescount[j].foodid == this.foodIds[i] ){
                        recipeCount[i] = this.recipescount[j].recipecount
                    }
                }
            }
            return recipeCount;
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
                <div v-if="recipescount.length <= 0" class="position-absolute alert alert-dark noData" role="alert">No recipes found
                </div>
                <Bar v-if="!isFiltering" :data="data" :options="options" />
            </div>
            <div class="collapse" id="collapseExample">
                Some placeholder content for the collapse component. This panel is hidden by default but revealed when the
                user activates the relevant trigger.
            </div>
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
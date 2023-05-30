<script lang="ts">

import { DBService } from '../../services/db.service';
import SpinnerComponent from '../SpinnerComponent.vue';
import RecipeItem from '../../components/RecipeItem.vue';
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

const dbService = new DBService;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    name: 'Recipe Counts',
    components: {
        SpinnerComponent,
        RecipeItem,
        Bar,
    },
    props: {
        foodIds: {
            type: Array<Number>,
            required: true,
        },
        label: {
            type: Array<String>,
            required: true,
        },
        recipesCount: {
            type: Array<Number>,
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
        getRecipeCount(): Array<number> {
            let recipeCount: Array<number> = new Array<number>(this.foodIds.length).fill(0);
            for (let i = 0; i < this.foodIds.length; i++) {
                for (let j = 0; j < this.recipesCount.length; j++) {
                    if (this.recipesCount[j].foodid == this.foodIds[i]) {
                        recipeCount[i] = this.recipesCount[j].recipecount
                    }
                }
            }
            return recipeCount;
        }
    }
}
</script>

<template>
    <div style="min-height: 353px; width: 800px;">
        <h3>Recipe Count List</h3>
        <div>
            <div v-if="isLoading" class="position-relative">
                <SpinnerComponent class="position-absolute spinner" />
                <Bar :data="data" :options="options" />
            </div>
            <div v-else="!isLoading" class="position-relative" >
                <div v-if="recipesCount.length <= 0" class="position-absolute alert alert-warning noDataRecipe"
                    role="alert">No recipes found
                </div>
                <Bar v-if="!isFiltering" :data="data" :options="options" style="min-height: 353px; width: 800px;"/>
            </div>
            <div class="collapse" id="collapseExample">
                This is the Recipe Count List. Here we can see the amount of recipes found for all the currently filtered foods. 
                Hovering over a bar shows the exact amount of recipes shown for the food in question.
            </div>
        </div>
    </div>
</template>

<style scoped>
.center-spinner {
    top: 90px;
    left: 230px
}

.noDataRecipe {
    top: 120px;
    left: 250px
}

.scrollview {
    height: 289px;
}</style>
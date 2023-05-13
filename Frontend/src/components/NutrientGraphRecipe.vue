<script lang="ts">
import { DBService, distinctNames } from '../services/db.service';
import { avg, mean, std } from '../services/statistics';
import type { Rows, Row, DistinctRows } from '../services/dbClasses';
import SpinnerComponent from './SpinnerComponent.vue';
import BarWithErrorBarChart from './../services/errorbar.chart';
import { GET_RECIPE_NUTRIENTS } from '../services/queries';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js/auto'

const dbService = new DBService;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    name: 'NutrientGraphRecipe',
    components: {
        SpinnerComponent,
        BarWithErrorBarChart
    },
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isLoading: true,
            noData: false,
            result: null as unknown as Rows,
            data: {
                labels: ['Total fat', 'Sugar', 'Sodium', 'Protein', 'Saturated fat', 'Carbohydrates'],
                datasets: [{
                    labels: ' ',
                    data: [0, 0, 0, 0, 0, 0]
                }]

            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        display: false
                    },
                },
                scales: {
                    y: {
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function (value: number) {
                                return value + "% daily value";
                            }
                        }
                    }
                }
            },
        }
    },
    created() {
        this.fetchData().then(() => {
            this.fillGraph()
        });
    },
    methods: {
        async fetchData() {
            const queryString: string = GET_RECIPE_NUTRIENTS(this.id.toString());
            this.result = await dbService.query(queryString, false);
            this.$nextTick(() => {
                this.loaded();
            })
        },
        loaded() {
            this.isLoading = false;
        },
        fillGraph(log: boolean = false) {
            let rows: Rows = this.result.rows as unknown as Rows;

            if (rows.length <= 0) {
                this.noData = true;
            } else {
                for(let i = 1; i < rows[0].nutritions.length; i++){
                    this.data.datasets[0].data[i-1] = rows[0].nutritions[i]
                }
            }
        },
    }
}
</script>

<template>
    <div style="width: 640px;">
        <h3>Nutrient Graph</h3>
        <div v-if="isLoading" class="position-relative">
            <SpinnerComponent class="position-absolute spinner" />
            <BarWithErrorBarChart :data="data" :options="options" />
        </div>
        <div v-else="!isLoading" class="position-relative">
            <div v-if="noData" class="position-absolute alert alert-dark noData" role="alert">No nutrient data available
            </div>
            <BarWithErrorBarChart :data="data" :options="options" />
        </div>
        <div class="collapse" id="collapseExample">
            Some placeholder content for the collapse component. This panel is hidden by default but revealed when the
            user activates the relevant trigger.
        </div>
    </div>
</template>

<style>
.spinner {
    top: 70px;
    left: 266px
}

.noData {
    top: 106px;
    left: 227px
}
</style>
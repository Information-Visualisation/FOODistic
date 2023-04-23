<script lang="ts">
import { DBService, distinctNames } from '../services/db.service';
import { avg, mean, std } from '../services/statistics';
import type { Rows, Row, DistinctRows } from '../services/db.service';
import SpinnerComponent from './SpinnerComponent.vue';
import BarWithErrorBarChart from './../services/errorbar.chart';
import { MACRO_NUTRIENTS_FOR } from '../services/queries';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js/auto'
import { Chart } from 'vue-chartjs'

const dbService = new DBService;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    name: 'NutrientGraph',
    components: {
        SpinnerComponent,
        BarWithErrorBarChart
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
            noData: false,
            result: null as unknown as Rows,
            data: {
                labels: ['Ash', 'Carbohydrate', 'Fat', 'Fatty Acid', 'Fiber', 'Proteins'],
                datasets: [{
                    labels: ' ',
                    backgroundColor: ["#171819", "#C5AD92", "#7D6D62", "#8bf60b", "#edd5b4", "#d57144"],
                    data: [{}, {}, {}, {}, {}, {}]
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
                                return value + ' mg/100g';
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
            const queryString: string = MACRO_NUTRIENTS_FOR(this.id);
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
                let distincts: DistinctRows = distinctNames(rows);
                const MACRO_NUTRIENTS: number = 6;

                let i = 0;
                Object.keys(distincts).forEach((key: string) => {
                    const values: number[] = distincts[key];

                    //alternative less biased values v
                    //let minAndMax: number[] = [Math.min(...values),Math.max(...values)];

                    const m = mean(values);
                    const s = std(values);
                    const upper = m+s;
                    const downer = m-s;

                    this.data.datasets[0].data[i++] = {y: m, yMin: downer, yMax: upper};
                });
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
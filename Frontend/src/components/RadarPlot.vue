<script lang="ts">
import { DBService, distinctNames } from '@/services/db.service';
import { mean } from '@/services/statistics';
import { GET_FOOD_FOR_ID, MACRO_NUTRIENTS_FOR } from '@/services/queries';
import type { FoodRow, Rows } from '@/services/dbClasses';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js'
import { Radar } from 'vue-chartjs'
import SpinnerComponent from './SpinnerComponent.vue';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
)

const dbService = new DBService;

export default {
    name: 'App',
    components: {
        SpinnerComponent,
        Radar,
    },
    props: {
        id: {
            type: String,
            required: true
        },
        otherId: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            isLoading: true,
            foodData: [] as FoodRow[],
            otherFoodData: [] as FoodRow[],
            rows: {} as Rows,
            otherRows: {} as Rows,
            data: {
                labels: [
                    'Ash',
                    'Carbohydrates',
                    'Fat',
                    'Fatty Acid',
                    'Fiber',
                    'Proteins',
                ],
                datasets: [
                    {
                        label: '',
                        data: [0, 0, 0, 0, 0, 0],
                        //TODO: This is hardcoded in the example
                        backgroundColor: 'rgba(179,181,198,0.2)',
                        borderColor: 'rgba(179,181,198,1)',
                        pointBackgroundColor: 'rgba(179,181,198,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(179,181,198,1)',
                    },
                    {
                        label: '',
                        data: [0, 0, 0, 0, 0, 0],
                        //TODO: This is hardcoded in the example
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        pointBackgroundColor: 'rgba(255,99,132,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255,99,132,1)',
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    created() {
        this.fetchData().then(() => {
            this.fillGraph()
            this.loaded();
        });

    },
    methods: {
        async fetchData() {
            this.foodData = (await dbService.query(GET_FOOD_FOR_ID(this.id))).rows;
            this.otherFoodData = (await dbService.query(GET_FOOD_FOR_ID(this.otherId))).rows;

            this.rows = (await dbService.query(MACRO_NUTRIENTS_FOR(this.id), false)).rows;
            this.otherRows = (await dbService.query(MACRO_NUTRIENTS_FOR(this.otherId), false)).rows;
        },
        loaded() {
            this.isLoading = false;
        },
        fillGraph(log: boolean = false) {
            this.data.datasets[0].label = this.foodData[0].naam;
            this.data.datasets[1].label = this.otherFoodData[0].naam;

            let distincts1 = distinctNames(this.rows!);
            let distincts2 = distinctNames(this.otherRows!);
            const MACRO_NUTRIENTS: number = 6;

            let i = 0;

            Object.keys(distincts1).forEach((key: string) => {
                const values1: number[] = distincts1[key];
                this.data.datasets[0].data[i++] = mean(values1);
            });

            i=0;

            Object.keys(distincts2).forEach((key: string) => {
                const values2: number[] = distincts2[key];
                this.data.datasets[1].data[i++] = mean(values2);
            });
        },
    }
}
</script>

<template>
    <h3>Radar Plot</h3>
    <div v-if="isLoading" class="position-relative">
        <SpinnerComponent class="position-absolute" />
        <Radar class="radar" :data="data" :options="options" />
    </div>
    <div v-else="!isLoading" class="position-relative">
        <div v-if="rows.length == 0 || otherRows.length == 0" class="position-absolute alert alert-dark noData"
            role="alert">No
            nutrient data available for one food
        </div>
        <Radar class="radar" :data="data" :options="options" />
    </div>
    <div class="collapse" id="collapseExample">
        This plot will show you a radar plot of the nutrient data for multiple food items. The axis are mg/100g.
    </div>
</template>

<style>
.radar {
    width: 400px;
    height: 400px;
}
</style>
  
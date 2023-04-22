<script lang="ts">
import { DBService, avg, distinctNames } from '@/services/db.service';
import { GET_FOOD_FOR_ID, MACRO_NUTRIENTS_FOR } from '@/services/queries';
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
            foodData: null,
            otherFoodData: null,
            rows: null,
            otherRows: null,
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
            this.foodData = await dbService.query(GET_FOOD_FOR_ID(this.id));
            this.otherFoodData = await dbService.query(GET_FOOD_FOR_ID(this.otherId));

            this.rows = await dbService.query(MACRO_NUTRIENTS_FOR(this.id), false);
            this.otherRows = await dbService.query(MACRO_NUTRIENTS_FOR(this.otherId), false);
        },
        loaded() {
            this.isLoading = false;
        },
        fillGraph(log: boolean = false) {
            let rows1 = this.rows!.rows;
            let rows2 = this.otherRows!.rows;

            this.data.datasets[0].label = this.foodData.rows[0].naam;
            this.data.datasets[1].label = this.otherFoodData.rows[0].naam;

            let distincts1 = distinctNames(rows1);
            let distincts2 = distinctNames(rows2);
            const MACRO_NUTRIENTS: number = 6;

            let i = 0;

            Object.keys(distincts1).forEach((key: string) => {
                const values1: number[] = distincts1[key];
                const length1: number = values1.length;
                this.data.datasets[0].data[i++] = avg(length1, values1);
            });

            i=0;

            Object.keys(distincts2).forEach((key: string) => {
                const values2: number[] = distincts2[key];
                const length2: number = values2.length;
                this.data.datasets[1].data[i++] = avg(length2, values2);
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
        Some placeholder content for the collapse component. This panel is hidden by default but revealed when the
        user activates the relevant trigger.
    </div>
</template>

<style>
.radar {
    width: 400px;
    height: 400px;
}
</style>
  
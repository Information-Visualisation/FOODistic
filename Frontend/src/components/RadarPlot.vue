<script lang="ts">
import { DBService, avg, distinctNames } from '@/services/db.service';
import { MACRO_NUTRIENTS_FOR } from '@/services/queries';
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
        otherid: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isLoading: true,
            result1: null,
            result2: null,
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
                        label: 'Dill',
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
                        label: 'Burdock',
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
        });

    },
    methods: {
        async fetchData() {
            console.log(await dbService.query(MACRO_NUTRIENTS_FOR(this.id), false));
            this.result2 = await dbService.query(MACRO_NUTRIENTS_FOR(this.otherid), false);
            this.loaded();
        },
        loaded() {
            this.isLoading = false;
        },
        fillGraph(log: boolean = false) {
            let rows1 = this.result1.rows;
            let rows2 = this.result2.rows;


            let distincts1 = distinctNames(rows1);
            let distincts2 = distinctNames(rows2);
            const MACRO_NUTRIENTS: number = 6;

            let i = 0;
            Object.keys(distincts1).forEach((key: string) => {
                const values1: number[] = distincts1[key];
                const values2: number[] = distincts2[key];
                const length1: number = values1.length;
                const length2: number = values2.length;

                this.data.datasets[0].data[i++] = avg(length1, values1);
                this.data.datasets[1].data[i++] = avg(length2, values2);
            });
        },
    }
}
</script>

<template>
     <h3>Radar Plot</h3>
        <div v-if="isLoading" class="position-relative">
            <SpinnerComponent class="position-absolute spinner" />
            <Radar class="radar" :data="data" :options="options" />
        </div>
        <div v-else="!isLoading" class="position-relative">
            <div v-if="this.result1.rows.rowCount == 0" class="position-absolute alert alert-dark noData" role="alert">No nutrient data available
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
  
<script lang="ts">

import { DBService, avg, distinctNames } from '../../services/db.service'
import type { Rows, Row, DistinctRows } from '../../services/db.service';
import { Bar } from 'vue-chartjs';
import SpinnerComponent from '../SpinnerComponent.vue';
import { MACRO_NUTRIENTS_FOR } from './queries';
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
    name: 'NutrientGraph',
    components: {
        SpinnerComponent,
        Bar
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
            result: null as unknown as Rows,
            data: {
                labels: ['Ash', 'Carbohydrate', 'Fat', 'Fatty Acid', 'Fiber', 'Proteins'],
                datasets: [{
                    labels: ' ',
                    backgroundColor: ["#171819", "#C5AD92", "#7D6D62", "#8bf60b", "#edd5b4", "#d57144"],
                    data: [0, 0, 0, 0, 0, 0]
                }]
            },
            options: {
                responsive: true,
                legend: {
                    labels: {
                        boxWidth: 0,
                    },
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem: any) {
                            return tooltipItem.yLabel;
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
            if (log) { this.logFetched(rows); }

            let distincts: DistinctRows = distinctNames(rows);
            const MACRO_NUTRIENTS: number = 6;

            let i = 0;
            Object.keys(distincts).forEach((key: string) => {
                const values: number[] = distincts[key];
                const length: number = values.length;

                //alternative less biased values v
                //let minAndMax: number[] = [Math.min(...values),Math.max(...values)];

                this.data.datasets[0].data[i++] = avg(length, values);
            });
        },
        logFetched(rows: Rows) {
            for (let i = 0; i < rows.length; i++) {
                let row: Row = rows[i];
                console.log(row.name + ": " + row.value);
            }
        }
    }
}
</script>

<template>
    <div style="height: 500px; width: 500px;">
        <div class="position-relative" v-if="isLoading">
            <SpinnerComponent class="position-absolute" style="top: 50px; left: 200px" />
            <Bar :data="data" :options="options" />
        </div>
        <div v-else="!isLoading">
            <Bar :data="data" :options="options" />
        </div>
        <p>TODO: FIX THE COLOR PALLETTE, DELETE STUPID "BLACK undefined"</p>
    </div>
</template>

<style></style>
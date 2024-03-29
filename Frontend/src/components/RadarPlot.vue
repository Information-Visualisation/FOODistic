<script lang="ts">
import { DBService, distinctNames, nutrientsFoodDB } from '@/services/db.service';
import { mean } from '@/services/statistics';
import { GET_FOOD_FOR_ID, NUTRIENTS_FOR } from '@/services/queries';
import type { DatasetStarRow, DistinctRows, FoodRow, NutrientRow, Rows } from '@/services/dbClasses';
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
import { foodColors } from '@/services/colors';

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
        foodNames: {
            type: Array<String>,
            required: true,
        },
        distinctRowsPerFood: {
            type: Array<DistinctRows>,
            required: true
        },
        focusedDataset: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            isLoading: true,
            data: {
                labels: nutrientsFoodDB,
                datasets: [] as Array<DatasetStarRow>,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.isLoading = true;
            this.data.datasets = [];
            for (let i = 0; i < this.distinctRowsPerFood.length; i++) {
                this.fillGraph(i, this.distinctRowsPerFood[i]);
            }
            this.$nextTick(() => { this.loaded() });
        },
        loaded() {
            this.isLoading = false;
        },
        fillGraph(i: number, rows: DistinctRows) {
            this.data.datasets.push(this.makeDatasetStarRow(i) as DatasetStarRow);

            this.data.datasets[i].label = this.foodNames[i] as string;

            // if (rows.length <= 0) {
            //     this.noData = true;
            // } else {
            // TODO: This obviously doesn't work

            let j = 0;

            Object.keys(rows).forEach((key: string) => {
                const values1: number[] = rows[key];
                this.data.datasets[i].data[j++] = mean(values1);
            });
            // }
        },
        makeDatasetStarRow(i: number): DatasetStarRow {
            const foodColor: string = this.getColorForFood(i);
            const opacity20: string = '33';
            const opacity100: string = 'FF';
            return {
                label: '',
                data: [0, 0, 0, 0, 0, 0],
                //TODO: This is hardcoded in the example
                backgroundColor: foodColor + opacity20,
                borderColor: foodColor + opacity100,
                pointBackgroundColor: foodColor + opacity100,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: foodColor + opacity100,
                hidden: this.focusedDataset == -1 ? false : i != this.focusedDataset,
            } as DatasetStarRow;
        },
        getColorForFood(i: number): string {
            if (this.foodNames.length == 1) {
                return '#000000'
            }
            return foodColors['food' + (i + 1).toString()];
        },
    },
    watch: {
        focusedDataset(n, o) {
            this.init();
        }
    }
}
</script>

<template>
    <div v-if="isLoading" class="position-relative">
        <SpinnerComponent class="position-absolute" />
        <Radar class="radar" :data="data" :options="options" />
    </div>
    <div v-else="!isLoading" class="position-relative">
        <!-- TODO: <div v-if="rows.length == 0 || otherRows.length == 0" class="position-absolute alert alert-dark noData"
            role="alert">No
            nutrient data available for one food
        </div> -->
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
  
<script lang="ts">
import { DBService, distinctNames, nutrientsFoodDB } from '../services/db.service';
import { avg, mean, std } from '../services/statistics';
import type { Rows, Row, DistinctRows, DatasetGraphRow, NutrientRow, FoodRow } from '../services/dbClasses';
import SpinnerComponent from './SpinnerComponent.vue';
import BarWithErrorBarChart from './../services/errorbar.chart';
import RadarPlot from './RadarPlot.vue';
import IconChart from './icons/IconChart.vue';
import IconStar from './icons/IconStar.vue';
import { GET_FOOD_FOR_ID, NUTRIENTS_FOR } from '../services/queries';
import { foodColors, nutrientColors } from '@/services/colors';
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
const labels = nutrientsFoodDB;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    name: 'NutrientGraph',
    components: {
        SpinnerComponent,
        BarWithErrorBarChart,
        RadarPlot,
        IconChart,
        IconStar,
    },
    props: {
        ids: {
            type: Array<String>,
            default: []
        },
        focusedDataset: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            isLoading: true,
            isRadarPlot: false,
            noData: false,
            noDataFor: [] as Array<string>,
            nutrientRowsPerFood: [] as Array<Array<NutrientRow>>,
            distinctRowsPerFood: [] as Array<DistinctRows>,
            foodNames: [] as Array<String>,
            data: {
                labels: labels,
                datasets: [] as Array<DatasetGraphRow>,
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        display: this.ids.length > 1,
                    },
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Amount in mg/100g'
                        },
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function (value: number) {
                                return value;
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Nutrients'
                        }
                    }
                },
                // errorBarWhiskerColor: foodColors.food1,
                // errorBarColor: foodColors.food1,
            },
        }
    },
    async created() {
        await this.fetchData();
    },
    methods: {
        async fetchData() {
            for (let i = 0; i < this.ids.length; i++) {
                const queryString: string = NUTRIENTS_FOR(this.ids[i] as string);
                await this.nutrientRowsPerFood.push((await dbService.query(queryString, false)).rows as Array<NutrientRow>);
                this.fillGraphFor(i);
            }
            this.$nextTick(() => { this.loaded(); })
        },
        loaded() {
            this.isLoading = false;
        },
        fillGraphFor(i: number) {
            let nutrientRow: Array<NutrientRow> = this.nutrientRowsPerFood[i];

            if (nutrientRow.length <= 0) {
                this.setNoData(i);
            } else {
                const foodName: string = nutrientRow[0].naam;
                this.foodNames.push(foodName);
                const comparingFoods: boolean = this.ids.length > 1;
                this.data.datasets.push({
                    label: foodName,
                    data: [{}, {}, {}, {}, {}, {}],
                    backgroundColor: comparingFoods ? [this.getColorForFood(i)] : this.getBarColor(),
                    borderColor: [''],
                    borderWidth: 0,
                    hidden: this.focusedDataset == -1 ? false : i != this.focusedDataset,
                } as DatasetGraphRow);
                let distincts: DistinctRows = distinctNames(nutrientRow);
                const MACRO_NUTRIENTS: number = 6;

                let j = 0;
                Object.keys(distincts).forEach((key: string) => {
                    const values: number[] = distincts[key];

                    //alternative less biased values v
                    //let minAndMax: number[] = [Math.min(...values),Math.max(...values)];

                    const m = mean(values);
                    const s = std(values);
                    const upper = m + s;
                    const downer = m - s;

                    const lastIndex: number = this.data.datasets.length - 1;
                    this.data.datasets[lastIndex].data[j++] = { y: m, yMin: downer, yMax: upper };
                });
                this.distinctRowsPerFood.push(distincts);
            }
        },
        async setNoData(i: number) {
            this.noData = true;
            this.data.datasets.push({
                label: 'No data',
                data: [{}, {}, {}, {}, {}, {}],
                backgroundColor: [''],
                borderColor: [''],
                borderWidth: 0,
                hidden: false,
            } as DatasetGraphRow);
            const foodData: FoodRow = (await dbService.query(GET_FOOD_FOR_ID(this.ids[i] as string))).rows[0];
            this.noDataFor.push(foodData.naam as string);
        },
        setGraph() {
            this.isRadarPlot = false;
        },
        setStarPlot() {
            this.isRadarPlot = true;
        },
        getBarColor() {
            let colors = [];
            for (let label of labels) {
                colors.push(nutrientColors[label as string]);
            } return colors;
        },
        getColorForFood(i: number): string {
            return foodColors['food' + (i + 1).toString()];
        },
        onlyUnique(value: any, index: number, array: Array<any>) {
            return array.indexOf(value) === index;
        }
    },
    watch: {
        focusedDataset(n, o) {
            this.isLoading = true;
            this.data.datasets = [];
            this.distinctRowsPerFood = [];
            for (let i = 0; i < this.ids.length; i++) {
                this.fillGraphFor(i);
            }
            this.$nextTick(() => { this.loaded() });
        }
    }
}
</script>

<template>
    <div style="width: 640px;">
        <div class="position-relative">
            <h3 v-if="!isRadarPlot" class="headerShrink">Nutrient Graph</h3>
            <h3 v-if="isRadarPlot" class="headerShrink">Nutrient Radar Plot</h3>
            <div class="position-absolute controls d-flex">
                <div v-if="noData" class="alert alert-warning noData" role="alert">No data for {{
                    noDataFor.filter(onlyUnique).join(', ') }}
                </div>
                <div class="btn-group btnGroup" role="group" aria-label="Basic example">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio1" checked>
                    <label class="btn btn-outline-success" for="btnradio1" @click="setGraph">
                        <IconChart />
                    </label>
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio2">
                    <label class="btn btn-outline-success" for="btnradio2" @click="setStarPlot">
                        <IconStar />
                    </label>
                </div>
            </div>
        </div>
        <div v-if="isLoading && !isRadarPlot" class="position-relative">
            <SpinnerComponent class="position-absolute spinner" />
            <BarWithErrorBarChart :data="data" :options="options" />
        </div>
        <div v-if="!isLoading && !isRadarPlot" class="position-relative">
            <!--TODO: Fix this if you have multiple!-->
            <BarWithErrorBarChart :data="data" :options="options" />
        </div>
        <div v-if="isLoading && isRadarPlot" class="position-relative">
            <SpinnerComponent class="position-absolute spinner" />
            <div class="row">
                <RadarPlot :foodNames="foodNames" :distinctRowsPerFood="distinctRowsPerFood"
                    :focusedDataset="focusedDataset"></RadarPlot>
            </div>
        </div>
        <div v-if="!isLoading && isRadarPlot">
            <div class="row">
                <RadarPlot :foodNames="foodNames" :distinctRowsPerFood="distinctRowsPerFood"
                    :focusedDataset="focusedDataset"></RadarPlot>
            </div>
        </div>
        <div class="collapse" id="collapseExample">
            Shows the nutrient data for the food in question. The axis are mg/100g.
        </div>
    </div>
</template>

<style>
.spinner {
    top: 70px;
    left: 266px
}

.noData {
    top: 0px;
    left: 0px;
    margin-right: 5px;
    height: 40px;
    padding: 7px;
}

.controls {
    top: 5px;
    right: 10px
}

.btnGroup {
    height: 40px;
}

.headerShrink {
    top: 0px;
    left: 0px;
    width: 300px;
}
</style>
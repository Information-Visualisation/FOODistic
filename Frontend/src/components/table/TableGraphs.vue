<script lang="ts">
import { foodColors, allergyColors } from '@/services/colors';

export default {
    props: {
        columnNames: {
            type: Array<string>,
            required: true,
        },
        percentages: {
            type: Array<number>,
            required: true,
        },
        counts: {
            type: Array<number>,
        }
    },
    methods: {
        calcBarHeight(percentage: number) {
            let height:number = percentage / 100 * 150; //150 is the max height
            return height + 'px';
        },
        getBarColor(index: number) {
            if (this.percentages[index].toString() === 'NaN')
                return "#000000";
            let header = this.columnNames[index];
            if (header in foodColors)
                return foodColors[header];
            else if (header in allergyColors)
                return allergyColors[header];
            else
                return '#000000';
        }
    }
}
</script>

<template>
    <tr>
    <th scope="col"></th> <!-- First one should be empty-->
    <th scope="col" v-for="(percentage, index) in percentages">
        <div class="bar-wrapper">
            <p class="bar-percentage" :style="{color: getBarColor(index)}">
                {{ Math.round(percentage * 100) / 100 + (percentage.toString() == 'NaN' ? '': '%')}}
            </p>
            <div v-if="counts != undefined" class="bar" :style="{height: calcBarHeight(percentage) , backgroundColor: getBarColor(index)}">
                {{ counts[index] }} <!-- Make it hoverable -->
            </div>
            <div v-if="counts == undefined" class="bar" :style="{height: calcBarHeight(percentage) , backgroundColor: getBarColor(index)}">
            </div>
        </div>
    </th>
    </tr>
</template>

<style scoped>
.bar-wrapper {
    width: 50px;
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.bar-percentage {
    text-align: center;
    height: 20px;
    margin-bottom: 5px;
    font-weight: bold;
}
/* 
.bar {
    background-color: brown;
} */


</style>
<script lang="ts">
import { nutrientColors, allergyColors } from '@/services/colors';

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
        },
        totaalFoods: {
            type: Number,
        },
        isNutrient: {
            type: Boolean,
            default: false,
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
            if (header in nutrientColors)
                return nutrientColors[header];
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
    <th scope="col"><div v-if="isNutrient" class="unit-indicator">mg/100g</div></th> <!-- First one should be empty-->
    <th scope="col" v-for="(percentage, index) in percentages">
        <div class="bar-wrapper">
            <p class="bar-percentage" :style="{color: getBarColor(index)}">
                {{ Math.round(percentage * 100) / 100 + (percentage.toString() == 'NaN' ? '': '%')}}
            </p>
            <div class="bar mytooltip" :style="{height: calcBarHeight(percentage) , backgroundColor: getBarColor(index)}">
                    <span v-if="counts != undefined" class="mytooltiptext">{{ counts[index] }} / {{ totaalFoods }} has this allergy</span>
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

.unit-indicator {
    height: 20px;
    margin-bottom: 5px;
    font-weight: bold;
}

/* 
.bar {
    background-color: brown;
} */

.mytooltip {
  position: relative;
  display: inline-block;
  /* border-bottom: 1px dotted black; */
}

.mytooltip .mytooltiptext {
  visibility: hidden;
  width: 180px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 2;
  bottom: 125%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.mytooltip .mytooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.mytooltip:hover .mytooltiptext {
  visibility: visible;
  opacity: 1;
}

</style>
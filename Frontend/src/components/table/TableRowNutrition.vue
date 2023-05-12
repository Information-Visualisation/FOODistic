<script lang="ts">
import FoodImg from '../FoodImg.vue';
import { foodColors } from '@/services/colors';

export default {
    props: {
        name: {type: String, required: true},
        id: {type: Number, required: true},
        items: {type: Array<number>, required: true},
        max_value: {type: Array<number>, required: true},
        columnNames: {type: Array<string>, required: true}
    },
    created() {
        //console.log(this.items);
        //console.log("max value: " + this.max_value)
    },
    methods: {
        calcBarWitdh(column: number, value: number) {
            if(value == undefined)
                return '0px';
            let width:number = (value/this.max_value![column])*75;
            return width + 'px';
        },
        getBarColor(index: number) {
            if (this.items[index] === undefined)
                return 'lightslategray';
            return foodColors[this.columnNames[index]];
        }
    },
    components: { FoodImg }
}
</script>

<template>
    <tr>
        <th @click="$router.push({ name: 'food', params: { name: name }, query: { id: id } })">
            <FoodImg :id="id!.toString()" :name="name!" :height="30"></FoodImg> {{ name }}
        </th>
        <td scope="col" v-for="(value, index) in items">
            <div class="sub-bar-wrapper">
                <div class="sub-bar" :style="{width: calcBarWitdh(items!.indexOf(value), value), backgroundColor: getBarColor(index)}"> </div>
                <p class="sub-bar-percentage" :style="{color: getBarColor(index)}">
                    {{ (Math.round(value as number * 100) / 100).toFixed(2) }}
                </p>
            </div>
        </td>
    </tr>
</template>

<style>
:root {
    --bar-chart-height: 30px;
}


.sub-bar-wrapper {
    height: var(--bar-chart-height);
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
}

.sub-bar-percentage {
    margin: 0px 5px 0px 5px;
    font-size: small;
    font-weight: bold;
}

.sub-bar {
    /* background-color: brown; */
    height: var(--bar-chart-height);
}

</style>
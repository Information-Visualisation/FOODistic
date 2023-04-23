<script lang="ts">
import FoodImg from '../FoodImg.vue';

export default {
    props: {
        name: String,
        id: Number,
        items: Object,
        max_value: Array<Number>
    },
    created() {
        console.log(this.items);
    },
    methods: {
        // calcBarWitdh(percentage: number) {
        //     let x = this.items?.indexOf(percentage) as number;
        //     let width:number = this.max_value![x-1]/100 + percentage ; //150 is the max height
        //     return width + 'px';
        // },
    },
    components: { FoodImg }
}
//class="bar-wrapper"
//class="bar-percentage"
</script>

<template>
    <tr>
        <th @click="$router.push({ name: 'food', params: { name: name }, query: { id: id } })">
            <FoodImg :id="id!.toString()" :name="name!" :height="30"></FoodImg> {{ name }}
        </th>
        <td scope="col" v-for="x in items">
            <div>
                <p>{{ (Math.round(x as number * 100) / 100).toFixed(2) }}</p>
                <!-- <div class="bar" :style="{width: calcBarWitdh(x as number)}"> </div> -->
            </div>
        </td>
    </tr>
</template>

<style>
:root {
    --bar-chart-height: 50px;
}


.bar-wrapper {
    height: var(--bar-chart-height);
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.bar-percentage {
    text-align: center;
    height: 20px;
    margin-right: 5px;
}

.bar {
    background-color: brown;
    height: var(--bar-chart-height);
}
</style>
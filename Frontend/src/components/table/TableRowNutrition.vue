<script lang="ts">
import FoodImg from '../FoodImg.vue';

export default {
    props: {
        name: String,
        id: Number,
        items: Object,
        max_value: Array<number>
    },
    created() {
        console.log(this.items);
    },
    methods: {
        // calcBarWitdh(column: number, value: number) {
        //     console.log(this.max_value);
        //     let width:number = this.max_value![column]/100 + value;
        //     return width + 'px';
        // },
    },
    components: { FoodImg }
}
</script>

<template>
    <tr>
        <th @click="$router.push({ name: 'food', params: { name: name }, query: { id: id } })">
            <FoodImg :id="id!.toString()" :name="name!" :height="30"></FoodImg> {{ name }}
        </th>
        <td scope="col" v-for="(value, name, index) in items">
            <div class="sub-bar-wrapper">
                <!-- <div class="sub-bar" :style="{width: calcBarWitdh(index, value)}"> </div> -->
                <p class="sub-bar-percentage">{{ (Math.round(value as number * 100) / 100).toFixed(2) }}</p>
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
    margin: 0px 0px 0px 5px;
}

.sub-bar {
    background-color: brown;
    height: var(--bar-chart-height);
}

</style>
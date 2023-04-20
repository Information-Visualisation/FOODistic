<script lang="ts">
export default {
    props: {
        items: Array<string | number>,
        max_value: Array<number>
    },
    methods: {
        calcBarWitdh(percentage: number) {
            let x = this.items?.indexOf(percentage) as number;
            let width:number = this.max_value![x-1]/100 + percentage ; //150 is the max height
            return width + 'px';
        },
        name() {
            return this.items?.[0];
        },
        columns() {
            return this.items?.slice(1);
        }
    }
}
</script>

<template>
    <tr>
    <th @click="$router.push({ name: 'food', params : { name: name() } })">{{name()}}</th>
    <th scope="col" v-for="x in columns()">
        <div class="bar-wrapper">
            <p class="bar-percentage">{{ x }}</p>
            <div class="bar" :style="{width: calcBarWitdh(x as number)}">
            </div>
        </div>
    </th>
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
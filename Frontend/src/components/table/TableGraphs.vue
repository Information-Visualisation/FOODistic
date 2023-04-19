<script lang="ts">
export default {
    props: {
        percentages: Array<number>,
    },
    methods: {
        calcBarHeight(percentage: number) {
            let height:number = percentage / 100 * 150; //150 is the max height
            return height + 'px';
        }
    }
}
</script>

<template>
    <tr>
    <th scope="col"></th> <!-- First one should be empty-->
    <th scope="col" v-for="percentage in percentages">
        <div class="bar-wrapper">
            <p class="bar-percentage">{{ percentage }}%</p>
            <div class="bar" :style="{height: calcBarHeight(percentage)}">
            </div>
        </div>
    </th>
    </tr>
</template>

<style>
:root {
    --bar-chart-width: 50px;
}


.bar-wrapper {
    width: var(--bar-chart-width);
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.bar-percentage {
    text-align: center;
    height: 20px;
    margin-bottom: 5px;
}

.bar {
    background-color: brown;
}

</style>
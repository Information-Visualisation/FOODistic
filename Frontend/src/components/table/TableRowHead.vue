<script lang="ts">
export default {
    data() {
        return {
            arrowUp: '↑',
            arrowDown: '↓',
            filterColumn: 0,
            sortDown: true,
        }
    },
    props: {
        columnNames: Array<string>
    },
    methods: {
        // TODO: filter list
        setSort(columnIndex: number) {
            if (this.filterColumn == columnIndex) {
                this.sortDown = !this.sortDown;
            } else {
                this.filterColumn = columnIndex;
                this.sortDown = true;
            }
        },
        getSortArrow(columnIndex: number) {
            if (this.filterColumn == columnIndex) {
                return this.sortDown ? this.arrowDown : this.arrowUp;
            } else {
                return '';
            }
        }
    }
}
</script>

<template>
    <tr>
    <th scope="col" v-for="(name, index) in columnNames">
        <button class="btn" type="button" :onclick="function() {setSort(index)}">
            {{name + ' ' + getSortArrow(index)}}
        </button>
    </th>
    </tr>
</template>

<style>

.btn {
    font-weight: bold;
    padding: 0px;
}

.th {
    width: 100px;
}

</style>
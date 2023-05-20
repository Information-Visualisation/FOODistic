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
    emits: ['sortByColumn'],
    props: {
        columnNames: Array<string>
    },
    methods: {
        setSort(columnIndex: number) {
            if (this.filterColumn == columnIndex) {
                this.sortDown = !this.sortDown;
            } else {
                this.filterColumn = columnIndex;
                this.sortDown = true;
            }
            this.$emit('sortByColumn', this.filterColumn, this.sortDown);
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
        <button class="sort btn" type="button" :onclick="function() {setSort(index)}">
            {{name + ' ' + getSortArrow(index)}}
        </button>
    </th>
    </tr>
</template>

<style scoped>

.sort {
    font-weight: bold;
    padding: 0px;
}

</style>
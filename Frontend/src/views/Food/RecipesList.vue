<script lang="ts">

import { DBService, avg, distinctNames } from '../../services/db.service'
import type { Rows, Row, DistinctRows } from '../../services/db.service';
import SpinnerComponent from '../SpinnerComponent.vue';
import RecipeItem from '../../components/RecipeItem.vue';
import { GET_RECIPES_FOR } from './queries';

const dbService = new DBService;

export default {
    name: 'NutrientGraph',
    components: {
        SpinnerComponent,
        RecipeItem,
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isLoading: true,
            recipes: null as unknown as Rows,
        }
    },
    created() {
        this.fetchData().then(() => {
            this.fillGraph()
        });

    },
    methods: {
        async fetchData() {
            const queryString: string = GET_RECIPES_FOR(this.id);
            this.recipes = await dbService.query(queryString, false);
            this.$nextTick(() => {
                this.loaded();
            })
        },
        loaded() {
            this.isLoading = false;
        },
        fillGraph(log: boolean = false) {
            let rows: Rows = this.recipes.rows as unknown as Rows;
            if (log) { this.logFetched(rows); }

            
        },
        logFetched(rows: Rows) {
            for (let i = 0; i < rows.length; i++) {
                let row: Row = rows[i];
                console.log(row.name + ": " + row.value);
            }
        }
    }
}
</script>

<template>
    <div style="height: 500px; width: 500px;">
        <div v-if="isLoading" class="position-relative">
            <SpinnerComponent class="position-absolute" style="top: 50px; left: 200px" />
        </div>
        <div v-else="!isLoading" class="container overflow-auto scrollview">
            <RecipeItem v-for="recipe in recipes.rows" :title=recipe.recipename :techniques=recipe.techniques></RecipeItem>
        </div>
    </div>
</template>

<style>
.scrollview {
    height: 250px;
    background-color: ghostwhite;
}
</style>
<script lang="ts">

import { DBService, avg, distinctNames } from '../services/db.service'
import type { Rows, Row, DistinctRows } from '../services/db.service';
import SpinnerComponent from './SpinnerComponent.vue';
import RecipeItem from '../components/RecipeItem.vue';
import { GET_RECIPES_FOR } from '../services/queries';

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
        this.fetchData();
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
    }
}
</script>

<template>
    <div style="min-height: 353px; width: 600px;">
        <h3>Recipe List</h3>
        <div v-if="isLoading" class="position-relative scrollview">
            <SpinnerComponent class="position-absolute center-spinner" />
        </div>
        <div v-else="!isLoading" class="container overflow-auto scrollview border rounded">
            <div v-if="recipes.rows.length<=0" class="position-absolute top-50 start-50 translate-middle alert alert-dark" role="alert">No recipes found</div>
            <ul class="list-group">
                <li class="list-group-item" v-for="recipe in recipes.rows">
                    <RecipeItem :title=recipe.recipename :techniques=recipe.techniques></RecipeItem>
                </li>
            </ul>
        </div>
        <div class="collapse" id="collapseExample">
            Some placeholder content for the collapse component. This panel is hidden by default but revealed when the
            user activates the relevant trigger.
            TODO: Still only shows 100 recipes!
            <ul>
                <li>explain list</li>
                <li>explain icons, here or on about page</li>
            </ul>
        </div>
    </div>
</template>

<style>
.center-spinner {
    top: 90px;
    left: 230px
}

.scrollview {
    height: 289px;
}
</style>
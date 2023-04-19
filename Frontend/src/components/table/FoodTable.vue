<script setup lang="ts">
import TableRowTemp from './TableRowTemp.vue';
import TablerowHead from './TableRowHead.vue';
import TableGraph from './TableGraphs.vue';
let test_items = [["apple", 2, 3, 4],["apple", 4, 5, 6], ["apple", 7, 8, 9],["apple", 2, 3, 4]]
</script>
<template>
    <div id="table">
        <!-- tabs -->
        <nav>
            <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-nutrition-tab" data-bs-toggle="tab" data-bs-target="#nav-nutrition" type="button" role="tab" aria-controls="nav-nutrition" aria-selected="true">Nutrition</button>
                <button class="nav-link" id="nav-allergies-tab" data-bs-toggle="tab" data-bs-target="#nav-allergies" type="button" role="tab" aria-controls="nav-allergies" aria-selected="false">Allergies</button>
                <button class="nav-link" id="nav-recipes-tab" data-bs-toggle="tab" data-bs-target="#nav-recipes" type="button" role="tab" aria-controls="nav-recipes" aria-selected="false">Recipes</button>
            </div>
        </nav>
        <!-- content -->
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-nutrition" role="tabpanel" aria-labelledby="nav-nutrition-tab" tabindex="0">
                <table class="table table-hover">
                <thead>
                    <TableGraph :percentages="[70, 15, 15]"/>
                </thead>
                <thead class="table-secondary">
                    <TablerowHead :columnNames="['Name', 'Salt', 'Glutes', 'Sugar']"/>
                </thead>
                <tbody>
                    <TableRowTemp v-for="i in test_items" :items='[i[0], i[1], i[2], i[3]]'/> <!-- change to foods and nutrition values-->
                </tbody>
                </table>
            </div>
            <div class="tab-pane fade" id="nav-allergies" role="tabpanel" aria-labelledby="nav-allergies-tab" tabindex="0">Allergies</div>
            <div class="tab-pane fade" id="nav-recipes" role="tabpanel" aria-labelledby="nav-recipes-tab" tabindex="0">Recipes</div>
        </div>
    </div>
</template>

<style>

#table {
    /* background-color: rgb(208, 208, 208); */
    margin: 5%;

}

.tab-pane {
    border-style: solid;
    border-width: 0px 1px 0px 1px;          /* top right bottom left */
    border-color: #dee2e6;                /* tried var(--bs-nav-tabs-link-active-border-color) but didn't work */  
}

</style>
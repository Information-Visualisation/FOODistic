<script lang="ts">
import FoodImg from '../FoodImg.vue';
import type { FoodAllergyRow } from '@/services/dbClasses';

export default {
    props: {
        name: String,
        id: Number,
        allergyNames: Array<string>,
        allergies: Array<FoodAllergyRow>,
    },
    created() {
    },
    components: { FoodImg },
    methods: {
        hasAllergy(allergy: string) {
            return this.allergies?.filter(function (item) { return item.allergy == allergy }).length != 0;
        },
        getImageUrl(allergy: string) {
            if (allergy.includes('Lactose')) {
                return new URL(`../../assets/allergies/Lactose intolerance.png`, import.meta.url).href
            }
            let url: string = new URL(`../../assets/allergies/${allergy}.png`, import.meta.url).href;
            return url.includes('undefined') ? new URL(`../../assets/allergies/checkbox.png`, import.meta.url).href : url;
        }
    }
}
</script>

<template>
    <tr>
        <th>
            <button @click="$router.push({ name: 'food', params: { name: name }, query: { id: id } })"
                class="btn btn-outline-success rounded-pill" type="button">
                <FoodImg :id="id!.toString()" :name="name!" :height="30"></FoodImg> {{ name }}
            </button>
        </th>
        <td scope="col" v-for="(allergy, index) in allergyNames">
            <div class="allergy-wrapper">
                <img v-if="hasAllergy(allergy)" :src="getImageUrl(allergy)" style="width: 50px" />
                <div v-else></div>
            </div>
        </td>
    </tr>
</template>

<style>
/* .allergy-wrapper {
    display: flex;
    justify-content: center;
} */
</style>
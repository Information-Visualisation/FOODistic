<script lang="ts">
import FoodImg from '../FoodImg.vue';

export default {
    props: {
        name: String,
        id: Number,
        allergyColumns: Array<string>,
        allergies: Array<Object>
    },
    created() {
    },
    components: { FoodImg },
    methods: {
        hasAllergy(allergy: string) {
            return this.allergies?.filter(function(item) {return item.allergy==allergy}).length != 0;
        },
        // getImgUrl(allergy: string) {
        //     return require(`@assets/allergies/${allergy}.png`);
        // },
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
        <th @click="$router.push({ name: 'food', params: { name: name }, query: { id: id } })">
            <FoodImg :id="id!.toString()" :name="name!" :height="30"></FoodImg> {{ name }}
        </th>
        <td scope="col" v-for="(allergy, index) in allergyColumns">
            <div class="allergy-wrapper">
                <img v-if="hasAllergy(allergy)" :src="getImageUrl(allergy)" style="width: 50px"/>
                <div v-else></div>
            </div>
        </td>
    </tr>
</template>

<style>
.allergy-wrapper {
    /* display: flex;
    justify-content: center; */
}

</style>
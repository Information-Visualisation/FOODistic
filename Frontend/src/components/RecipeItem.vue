<script lang="ts">
import SpinnerComponent from '@/views/SpinnerComponent.vue';
import TechniqueIcon from './TechniqueIcon.vue';

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    techniques: {
      type: String,
      required: true
    }
  },
  components: {
    TechniqueIcon,
    SpinnerComponent
  },
  created() {
    this.getFilteredTechniques();
  },
  data() {
    return {
      isLoading: true,
      //https://github.com/majumderb/recipe-personalization/blob/master/recipe_gen/language.py 
      techniqueStrings: new Array<string>('bake', 'barbecue', 'blanch', 'blend', 'boil', 'braise', 'brine', 'broil', 'caramelize', 'combine', 'crock pot', 'crush', 'deglaze', 'devein', 'dice', 'distill', 'drain', 'emulsify', 'ferment', 'freeze', 'fry', 'grate', 'griddle', 'grill', 'knead', 'leaven', 'marinate', 'mash', 'melt', 'microwave', 'parboil', 'pickle', 'poach', 'pour', 'pressure cook', 'puree', 'refrigerate', 'roast', 'saute', 'scald', 'scramble', 'shred', 'simmer', 'skillet', 'slow cook', 'smoke', 'smooth', 'soak', 'sous-vide', 'steam', 'stew', 'strain', 'tenderize', 'thicken', 'toast', 'toss', 'whip', 'whisk'),
    }
  },
  methods: {
    getFilteredTechniques() {
      let boolList: Array<Boolean> = this.techniques.slice(1, -1).replace(/\s/g, '').split(',').map(x => x === '1');
      let tempTechniqueStrings: Array<string> = new Array<string>();
      for (let i = 0; i < boolList.length; i++) {
        if (boolList[i] == true) {
          tempTechniqueStrings.push(this.techniqueStrings[i]);
        }
      }
      this.techniqueStrings = tempTechniqueStrings;
      this.isLoading = false;
    }
  }
}
</script>

<template>
  <div v-if="isLoading">
    <SpinnerComponent class="mx-auto p-2" />
  </div>
  <div class="position-relative">
    <div class="row">
      <div class="col">
        {{ title.replace(/\b\w/g, (x) => x.toUpperCase()) }}
      </div>
      <div class="col">
        <div v-for="technique in techniqueStrings" class="">
          <TechniqueIcon :technique="technique"></TechniqueIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

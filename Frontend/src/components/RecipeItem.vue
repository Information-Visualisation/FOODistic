<script lang="ts">
import { getFilteredTechniques } from '@/services/cookingtechniques';
import SpinnerComponent from './SpinnerComponent.vue';
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
    this.techniqueStrings = getFilteredTechniques(this.techniques);
    this.isLoading = false;
  },
  data() {
    return {
      isLoading: true,
      techniqueStrings: ['']
    }
  },
  methods: {
    
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

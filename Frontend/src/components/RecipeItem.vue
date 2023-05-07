<script lang="ts">
import { getFilteredTechniques } from '@/services/cookingtechniques';
import SpinnerComponent from './SpinnerComponent.vue';
import TechniqueIcon from './TechniqueIcon.vue';

export default {
  props: {
    recipeName: {
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
  emits: ["checked"],
  methods: {
    mouseOverChecked(e: any) {
      if (e.shiftKey) {
        this.differentChecked();
      }
    },
    differentChecked() {
      // @ts-ignore --> ignore error that is not an error
      const isCurrent: boolean =  this.$refs.filtered!.ariaCurrent == 'true';
      // @ts-ignore --> ignore error that is not an error
      this.$refs.filtered!.ariaCurrent = isCurrent ? 'false' : 'true';
      if (isCurrent) {
        // @ts-ignore --> ignore error that is not an error
        this.$refs.filtered!.classList.remove('active');
      } else {
        // @ts-ignore --> ignore error that is not an error
        this.$refs.filtered!.classList.add('active');
      }
      this.getsChecked(!isCurrent);
    },
    getsChecked(isCurrent: boolean) {
      this.$emit('checked', null, this.recipeName, isCurrent);
    }
  }
}
</script>

<template>
  <li ref="filtered" class="list-group-item list-group-item-action" :aria-current="false" @click="differentChecked" @mouseenter="mouseOverChecked">
    <div v-if="isLoading">
      <SpinnerComponent class="mx-auto p-2" />
    </div>
    <div class="position-relative">
      <div class="row">
        <div class="col text-start">
          {{ recipeName.replace(/\b\w/g, (x) => x.toUpperCase()) }}
        </div>
        <div class="col">
          <div v-for="technique in techniqueStrings" class="">
            <TechniqueIcon :technique="technique"></TechniqueIcon>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<style></style>

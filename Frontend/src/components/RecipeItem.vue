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
      type: Array<boolean>,
      required: true
    },
    ofFoods: {
      type: Array<Number>,
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
      const isCurrent: boolean = this.$refs.filtered!.ariaCurrent == 'true';
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
    },
  }
}
</script>

<template>
  <li ref="filtered" class="list-group-item list-group-item-action" :aria-current="false" @click="differentChecked"
    @mouseenter="mouseOverChecked">
    <div v-if="isLoading">
      <SpinnerComponent class="mx-auto p-2" />
    </div>
    <div class="position-relative hoverCursor">
      <div class="row">
        <div class="col text-start">
          {{ recipeName.replace(/\b\w/g, (x) => x.toUpperCase()) }}
        </div>
        <div v-if="ofFoods[0] != -1" class="col">
          <div class="row foodIndicatorCol">
            <div v-for="food,i in ofFoods" :class="'rounded-circle foodIndicator food'+ofFoods[i].toString()"/>
          </div>
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

<style>
.hoverCursor {
  cursor: pointer;
}

.foodIndicatorCol {
  margin-left: 0px;
}

.foodIndicator {
  width: 10px !important;
  height: 10px !important;
  padding: 0px !important;
  margin: 1px !important;
  flex-shrink: 0 !important;
  max-width: none !important;
  padding-right: 0px !important;
  padding-left: 0px !important; 
  margin-top: 0px !important;
}

.food1 {
  background-color: #8DD3C7;
}

.food2 {
  background-color: #FB8072;
}

.food3 {
  background-color: #BEBADA;
}

.food4 {
  background-color: #fcfc74;
}

.food5 {
  background-color: #80B1D3;
}

.food0 {
  background-color: #222222;
}

</style>

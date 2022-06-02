<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :class="`${rootClass}__link`"
    :to="to"
    :exact="exact"
    @click="$emit('click')"
    ><InlineSvg
      v-if="predefinedIcon"
      class="nav-link-img"
      :src="require(`@/assets/images/${predefinedIcon}`)"
    />
    <i v-else :class="icon" class="nav-link-img" />
    <span :class="`${rootClass}__link-label`">{{ $t(label) }}</span>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
import InlineSvg from 'vue-inline-svg'

export default Vue.extend({
  components: {
    InlineSvg,
  },
  props: {
    rootClass: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
    predefinedIcon: {
      type: String,
      default: null,
    },
    exact: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

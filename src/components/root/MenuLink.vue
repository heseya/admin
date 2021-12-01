<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :class="`${rootClass}__link`"
    :to="to"
    :exact="exact"
    @click="$emit('click')"
  >
    <InlineSvg class="nav-link-img" :src="require(`@/assets/images/${icon}`)" />
    <span :class="`${rootClass}__link-label`">{{ label }}</span>
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
      required: true,
    },
    exact: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

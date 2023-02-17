<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :class="`${rootClass}__link`"
    :to="to"
    :exact="exact"
    @click="$emit('click')"
  >
    <InlineSvg v-if="svgIconPath" class="nav-link-img" :src="`/img/${svgIconPath}`" />
    <img v-else-if="iconPath" :src="iconPath" class="nav-link-img" />
    <i v-else :class="iconClass" class="nav-link-img nav-link-svg" />
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
    iconClass: {
      type: String,
      default: null,
    },
    iconPath: {
      type: String,
      default: null,
    },
    svgIconPath: {
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

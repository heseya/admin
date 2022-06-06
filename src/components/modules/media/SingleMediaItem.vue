<template>
  <media-element
    v-if="thumbnailObject"
    :name="thumbnailObject.src"
    :media="thumbnailObject"
    :size="350"
  />
  <i v-else class="product-box__img-icon bx bx-image"></i>
</template>

<script lang="ts">
import Vue from 'vue'

import MediaElement from '@/components/MediaElement.vue'

export default Vue.extend({
  components: {
    MediaElement,
  },
  props: {
    thumbnailObject: {
      type: Object,
      default: null,
    },
  },
})
</script>

<style lang="scss" scoped></style>

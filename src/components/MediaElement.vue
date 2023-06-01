<template>
  <picture-element
    v-if="media.type === CdnMediaType.Photo"
    class="media-element media-element--picture"
    :src="media.url"
    :width="size"
    :height="size"
    :object-fit="objectFit"
    :alt="media.alt || ''"
  />
  <video
    v-else-if="media.type === CdnMediaType.Video"
    class="media-element media-element--video"
    :src="media.url"
    autoplay
    loop
    muted
  />
  <div
    v-else-if="media.type === CdnMediaType.Document"
    class="media-element media-element--document"
  >
    <i class="bx bxs-file-pdf"></i>
  </div>
  <div v-else-if="media.type === CdnMediaType.Other" class="media-element media-element--other">
    <i class="bx bxs-file-pdf"></i>
  </div>
  <div v-else class="media-element media-element--unknown">{{ $t('unknownType') }}</div>
</template>

<i18n lang="json">
{
  "pl": {
    "unknownType": "Nieznany typ pliku"
  },
  "en": {
    "unknownType": "Unknown media type"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { CdnMedia, CdnMediaType } from '@heseya/store-core'

import PictureElement from './PictureElement.vue'
import { FEATURE_FLAGS } from '@/consts/featureFlags'

export default defineComponent({
  components: { PictureElement },
  props: {
    media: {
      type: Object as PropType<CdnMedia>,
      required: true,
    },
    size: {
      type: Number,
      default: 350,
    },
    fit: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    CdnMediaType(): typeof CdnMediaType {
      return CdnMediaType
    },
    objectFit(): string {
      return (
        this.fit ?? (+this.$accessor.config.env[FEATURE_FLAGS.ProductContain] ? 'contain' : 'cover')
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.media-element {
  &--document,
  &--other {
    font-size: 2rem;
    display: flex !important;
    justify-content: center;
    align-items: center;
  }
}
</style>

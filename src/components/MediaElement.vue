<template>
  <picture-element
    v-if="media.type === CdnMediaType.Photo"
    class="media-element media-element--picture"
    :src="media.url"
    :width="size"
    :height="size"
    :object-fit="objectFit"
    :alt="media.alt"
  />
  <video
    v-else-if="media.type === CdnMediaType.Video"
    class="media-element media-element--video"
    :src="media.url"
    autoplay
    loop
    muted
  />
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
import Vue from 'vue'
import { CdnMedia, CdnMediaType } from '@heseya/store-core'

import PictureElement from './PictureElement.vue'

export default Vue.extend({
  components: { PictureElement },
  props: {
    media: {
      type: Object,
      required: true,
    } as Vue.PropOptions<CdnMedia>,
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
      return this.fit ?? +this.$accessor.config.env.dashboard_products_contain ? 'contain' : 'cover'
    },
  },
})
</script>

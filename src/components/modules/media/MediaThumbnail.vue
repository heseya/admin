<template>
  <img
    v-if="media.type === CdnMediaType.Photo"
    class="media-element media-element--media"
    :src="`${media.url}?w=${size}&h=${size}`"
    :style="{ objectFit }"
  />
  <video
    v-else-if="media.type === CdnMediaType.Video"
    class="media-element media-element--video"
    :src="media.url"
    autoplay
    loop
    muted
  />
  <i v-else-if="media.type === CdnMediaType.Pdf" class="bx bxs-file-pdf media-element--pdf"></i>
  <div v-else class="media-element media-element--unknown">{{ $t('unknownType') }}</div>
</template>

<i18n>
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
import { CdnMedia, CdnMediaType } from '@/interfaces/Media'

export default Vue.extend({
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
      return this.fit ?? +this.$accessor.env.dashboard_products_contain ? 'contain' : 'cover'
    },
  },
})
</script>

<style lang="scss" scoped>
.media-element {
  background: red;

  &--pdf {
    font-size: 2rem;
    display: grid;
    place-items: center;
  }
}
</style>

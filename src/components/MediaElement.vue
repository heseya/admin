<template>
  <img
    v-if="media.type === CdnMediaType.Photo"
    class="media-element media-element--media"
    :src="`${media.url}?w=350&h=350`"
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
  <div v-else class="media-element media-element--unknown">unknown media type</div>
</template>

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
  },
  computed: {
    CdnMediaType(): typeof CdnMediaType {
      return CdnMediaType
    },
    objectFit(): string {
      return +this.$accessor.env.dashboard_products_contain ? 'contain' : 'cover'
    },
  },
})
</script>

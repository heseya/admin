<template>
  <picture v-if="!isError" class="media-picture" @error="handleError" v-on="$listeners">
    <source v-if="webpUrl" :srcset="webpUrl" type="image/webp" />
    <source v-if="jpegUrl" :srcset="jpegUrl" type="image/jpeg" />
    <source v-if="baseUrl" :srcset="baseUrl" />
    <img
      :src="baseUrl"
      :alt="alt"
      :class="`media-picture__img media-picture__img--fit-${objectFit} media-picture__img--position-${objectPosition}`"
      @error="handleError"
    />
  </picture>
  <img v-else class="media-picture-placeholder" />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    src: {
      type: String,
      required: false,
      default: undefined,
    },
    width: {
      type: [Number, String],
      default: null,
    },
    height: {
      type: [Number, String],
      default: null,
    },
    objectPosition: {
      type: String,
      default: 'top',
    },
    objectFit: {
      type: String,
      default: 'cover',
    },
    alt: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    isError: false,
  }),
  computed: {
    baseUrl(): string {
      if (!this.src) return ''
      if (!this.width || !this.height) return this.src

      const url = new URL(this.src)

      url.searchParams.append('w', this.width.toString())
      url.searchParams.append('h', this.height.toString())

      return url.toString()
    },

    jpegUrl(): string {
      if (!this.baseUrl) return ''
      const url = new URL(this.baseUrl)
      url.searchParams.append('format', 'jpeg')
      return url.toString()
    },

    webpUrl(): string {
      if (!this.baseUrl) return ''
      const url = new URL(this.baseUrl)
      url.searchParams.append('format', 'webp')
      return url.toString()
    },
  },
  methods: {
    handleError() {
      this.$emit('error')
      this.isError = true
    },
  },
})
</script>

<style lang="scss" scoped>
.media-picture {
  &__img {
    width: 100%;
    height: 100%;
    max-width: inherit;
    max-height: inherit;
    display: block;
    object-position: top;
    object-fit: contain;
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;

    &--fit-contain {
      object-fit: contain;
    }
    &--fit-cover {
      object-fit: cover;
    }
    &--fit-fill {
      object-fit: fill;
    }
    &--fit-none {
      object-fit: none;
    }
    &--fit-scale-down {
      object-fit: scale-down;
    }

    &--position-top {
      object-position: top;
    }
    &--position-center {
      object-position: center;
    }
    &--position-bottom {
      object-position: bottom;
    }
    &--position-right {
      object-position: right;
    }
    &--position-left {
      object-position: left;
    }
  }
}
</style>

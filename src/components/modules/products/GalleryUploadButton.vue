<template>
  <media-uploader
    v-if="!disabled"
    class="gallery-upload-btn undragabble"
    :class="{
      'gallery-upload-btn--drag': isDrag,
      'gallery-upload-btn--big': big,
      'gallery-upload-btn--loading': isLoading,
    }"
    multiple
    :disabled="isLoading"
    @drag-change="dragChange"
    @upload-start="onUploadStart"
    @upload="onImageUpload"
    @error="onUploadError"
  >
    <img src="@/assets/images/icons/plus-icon.svg" />
  </media-uploader>
</template>

<script lang="ts">
import Vue from 'vue'
import { CdnMedia } from '@heseya/store-core'

import MediaUploader from '../media/MediaUploader.vue'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: { MediaUploader },
  props: {
    disabled: { type: Boolean, default: false },
    big: { type: Boolean, default: false },
  },
  data: () => ({
    isLoading: false,
    isDrag: false,
  }),
  methods: {
    dragChange(isDrag: boolean) {
      this.isDrag = isDrag
    },

    onUploadStart() {
      this.isLoading = true
    },

    onUploadError(error: any) {
      this.isLoading = false
      this.$emit('error', formatApiNotificationError(error))
    },

    onImageUpload(media: CdnMedia[]) {
      this.isLoading = false
      this.$emit('upload', media)
    },
  },
})
</script>

<style lang="scss" scoped>
.gallery-upload-btn {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background-color: #ffffff;
  box-shadow: $shadow;
  border-radius: 7px;

  &::before {
    $size: 48px;

    content: '';
    display: block;
    position: absolute;
    top: calc(50% - ($size / 2));
    left: calc(50% - ($size / 2));
    width: $size;
    height: $size;
    border-radius: 50%;
    border: solid 3px $font-color;
    border-top-color: transparent;
    transition: 0.3s;
    animation: spin infinite 1s;
    opacity: 0;
  }

  &--big {
    width: 50%;
    padding-top: 50%;
    margin-top: 0;
  }

  img {
    position: absolute;
    top: 40%;
    left: 40%;
    height: 20%;
    width: 20%;
    transition: 0.3s;
  }

  &:hover,
  &--drag {
    img {
      transform: scale(1.5);
    }
  }

  &--loading {
    background-color: #eee;
    cursor: no-drop;

    img {
      opacity: 0;
    }

    &::before {
      opacity: 1;
    }
  }
}
</style>

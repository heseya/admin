<template>
  <media-uploader
    v-if="!disabled"
    class="gallery-upload-btn"
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
    <img class="gallery-upload-btn__img" src="@/assets/images/icons/plus-icon.svg" />
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
  padding-top: 50%;
  background-color: #f7f7f8;
  border: 1px dashed #d9dbe0;
  border-radius: 4px;

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

  &__img {
    display: block;
    padding: 24px;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 68px;
    width: 68px;
    transition: 0.3s;
  }

  &:hover,
  &--drag {
    img {
      transform: translate(-50%, -50%) scale(1.2);
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

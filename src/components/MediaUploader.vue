<template>
  <div
    class="media-uploader"
    :class="{ 'media-uploader--drag': isDrag, 'media-uploader--disabled': disabled }"
    @click="selectFiles"
    @drop.prevent="dropFiles"
    @dragover.prevent="() => {}"
    @dragenter.prevent="changeDrag(true)"
    @dragleave.prevent="changeDrag(false)"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { getLastElement } from '@/utils/utils'
import { uploadMedia } from '@/services/uploadMedia'

export default Vue.extend({
  name: 'MediaUploader',
  props: {
    extensions: {
      type: Array,
      default: () => [
        // disabled frontend validation
        // 'jpg',
        // 'jpeg',
        // 'png',
        // 'gif',
        // 'bmp',
        // 'svg',
        // 'mp4',
        // 'webm',
        // 'webp',
        // 'ogg',
        // 'avi',
        // 'mov',
        // 'wmv',
      ],
    } as Vue.PropOptions<string[]>,
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isDrag: false,
  }),
  methods: {
    selectFiles() {
      if (this.disabled) return

      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = this.multiple

      input.onchange = (e: any) => {
        const files = e?.target?.files as File[]
        if (files.length) {
          this.$emit('drop', this.multiple ? [...files] : files[0])
          this.upload([...files])
        }
      }

      input.click()
    },
    dropFiles(e: any) {
      if (this.disabled) return
      const files = e?.dataTransfer?.files as File[]

      if (files.length) {
        this.changeDrag(false)
        this.$emit('drop', this.multiple ? [...files] : files[0])
        this.upload(this.multiple ? [...files] : [files[0]])
      }
    },
    async upload(files: File[]) {
      if (files.some((f) => !this.isFileValid(f))) {
        this.$toast.error(
          `Obsługiwane są tylko pliki z rozszerzeniami: ${this.extensions.join(', ')}`,
        )
        return
      }

      this.$accessor.startLoading()

      files.forEach(async (rawFile) => {
        const { success, file, error } = await uploadMedia(rawFile)
        if (success && file) {
          this.$emit('upload', file)
        } else {
          this.$emit('error', error)
        }
      })

      this.$accessor.stopLoading()
    },
    isFileValid(file: File) {
      if (!file) return false
      const extension = getLastElement(file.name.split('.'))?.toLowerCase()
      return this.extensions.length ? this.extensions.some((ext) => ext === extension) : true
    },
    changeDrag(isDrag: boolean) {
      this.isDrag = isDrag
      this.$emit('dragChange', isDrag)
    },
  },
})
</script>

<style lang="scss">
.media-uploader {
  cursor: pointer;

  // hack to force whole child element area to behave as a dropzone
  > * {
    position: relative;

    &::before {
      content: '';
      z-index: 10;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<template>
  <div
    class="media-uploader"
    :class="{ 'media-uploader--drag': isDrag }"
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
  data: () => ({
    isDrag: false,
    file: null as null | File,
  }),
  props: {
    extensions: {
      type: Array,
      default: () => ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'],
    } as Vue.PropOptions<string[]>,
  },
  methods: {
    selectFiles() {
      const input = document.createElement('input')
      input.type = 'file'

      input.onchange = (e: any) => {
        this.file = e?.target?.files?.[0]
        if (this.file) {
          this.$emit('drop', this.file)
          this.upload()
        }
      }

      input.click()
    },
    dropFiles(e: any) {
      this.file = e?.dataTransfer?.files?.[0] as File
      if (this.file) {
        this.changeDrag(false)
        this.$emit('drop', this.file)
        this.upload()
      }
    },
    async upload() {
      if (!this.isFileValid()) {
        this.$vs.notification({
          color: 'danger',
          title: 'Złe rozszerzenie pliku',
          text: `Obsługiwane są tylko pliki z rozszerzeniami: ${this.extensions.join(', ')}`,
        })
        return
      }

      this.$accessor.startLoading()

      const { success, file, error } = await uploadMedia(this.file!)
      if (success && file) {
        this.$emit('upload', file.url)
        this.file = null
      } else {
        this.$emit('error', error)
      }

      this.$accessor.stopLoading()
    },
    isFileValid() {
      if (!this.file) return false
      const extension = getLastElement(this.file.name.split('.'))?.toLowerCase()
      return this.extensions.some((ext) => ext === extension)
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

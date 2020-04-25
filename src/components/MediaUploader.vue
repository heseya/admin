<template>
  <div
    class="media-uploader"
    @drop.prevent="addFile"
    @dragenter.prevent="changeDrag(true)"
    @dragover.prevent
    @dragleave.prevent="changeDrag(false)"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MediaUploader',
  data: () => ({
    rawFiles: []
  }),
  methods: {
    addFile(e) {
      this.rawFiles = [...e.dataTransfer.files]
      this.$emit('drop', this.rawFiles)
      this.changeDrag(false)
      this.upload()
    },
    async upload() {
      // TODO
      console.log('files', this.rawFiles)
      this.$emit('upload', [1, 2])
    },
    changeDrag(isDrag) {
      this.$emit('dragChange', isDrag)
    }
  }
}
</script>

<style lang="scss">
.media-uploader {
}
</style>

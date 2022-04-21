<template>
  <div class="gallery">
    <draggable
      v-model="images"
      class="gallery__images"
      :options="{ filter: '.undragabble' }"
      :disabled="disabled"
    >
      <div v-for="image in images" :key="image.url" class="gallery__img">
        <media-element :media="image" :size="350" />
        <div class="gallery__remove-img">
          <icon-button v-if="!disabled" type="danger" @click="onImageDelete(image.id)">
            <template #icon>
              <i class="bx bx-trash"></i>
            </template>
          </icon-button>
        </div>

        <media-edit-form
          class="gallery__edit-img"
          :disabled="disabled"
          :media="image"
          @update="updateMedia"
        />
      </div>

      <gallery-upload-button :big="images.length === 0" @upload="onImageUpload" />
    </draggable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'

import { UUID } from '@/interfaces/UUID'
import { CdnMedia, CdnMediaType } from '@/interfaces/Media'
import { removeMedia } from '@/services/uploadMedia'

import MediaEditForm from '@/components/modules/media/MediaEditForm.vue'
import MediaElement from '@/components/MediaElement.vue'
import GalleryUploadButton from './GalleryUploadButton.vue'

export default Vue.extend({
  components: {
    Draggable,
    MediaEditForm,
    MediaElement,
    GalleryUploadButton,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<CdnMedia[]>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    mediaToDelete: [] as UUID[],
  }),
  computed: {
    CdnMediaType(): typeof CdnMediaType {
      return CdnMediaType
    },
    images: {
      get(): CdnMedia[] {
        return this.value
      },
      set(val: CdnMedia[]) {
        this.$emit('input', val)
      },
    },
  },
  mounted() {
    window.addEventListener('beforeunload', this.removeTouchedFiles)
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.removeTouchedFiles)
    this.removeTouchedFiles()
  },
  methods: {
    onImageDelete(deletedId: UUID) {
      this.images = this.images.filter(({ id }) => deletedId !== id)

      if (this.mediaToDelete.find((id) => deletedId === id)) {
        this.mediaToDelete = this.mediaToDelete.filter((id) => deletedId !== id)
        removeMedia(deletedId)
      }
    },
    onImageUpload(file: CdnMedia) {
      this.images = [...this.images, file]
      this.mediaToDelete = [...this.mediaToDelete, file.id]
    },
    clearMediaToDelete() {
      this.mediaToDelete = []
    },

    updateMedia(file: CdnMedia) {
      const index = this.images.findIndex((image) => image.id === file.id)
      this.images.splice(index, 1, file)
    },

    async removeTouchedFiles() {
      await Promise.all(this.mediaToDelete.map(removeMedia))
      this.clearMediaToDelete()
    },
  },
})
</script>

<style lang="scss">
.gallery {
  &__images {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 10px;

    *:first-child {
      grid-column: 1/3;
      grid-row: 1/3;
    }
  }

  &__img {
    position: relative;
    width: 100%;
    padding-top: 100%;
    margin-bottom: 4px;
    background-color: #ffffff;
    box-shadow: $shadow;
    border-radius: 7px;

    .media-element {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      background-color: #ffffff;
      border-radius: 7px;
    }
  }

  &__remove-img,
  &__edit-img {
    position: absolute;
    top: -15px;
    right: -10px;
    transition: 0.3s;
    visibility: hidden;
    opacity: 0;
  }

  &__edit-img {
    right: 24px;
  }

  &__img:hover &__remove-img,
  &__img:hover &__edit-img {
    top: -10px;
    visibility: visible;
    opacity: 1;
  }
}
</style>

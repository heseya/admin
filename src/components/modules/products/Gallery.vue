<template>
  <div class="gallery">
    <media-upload-input
      :disabled="disabled"
      class="gallery__upload-btn"
      icon-path="/img/icons/plus-icon.svg"
      @upload="onImageUpload"
    />

    <span class="gallery__info-text"> {{ $t('infoText') }} </span>

    <draggable v-model="images" class="gallery__images" :disabled="disabled">
      <div v-for="image in images" :key="image.url" class="gallery__img">
        <media-element :media="image" :size="350" />
        <div class="gallery__remove-img">
          <icon-button v-if="!disabled" type="danger" size="small" @click="onImageDelete(image.id)">
            <template #icon>
              <i class="bx bx-trash"></i>
            </template>
          </icon-button>
        </div>

        <media-edit-form
          class="gallery__edit-img"
          :disabled="disabled"
          :media="image"
          @updated="updateMedia"
        />
      </div>
    </draggable>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "infoText": "Przeciągaj elementy aby ustawić ich kolejność"
  },
  "en": {
    "infoText": "Drag and drop elements to set their order"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import Draggable from 'vuedraggable'
import { CdnMedia, CdnMediaType } from '@heseya/store-core'

import { UUID } from '@/interfaces/UUID'
import { removeMedia } from '@/services/uploadMedia'

import MediaEditForm from '@/components/modules/media/MediaEditForm.vue'
import MediaElement from '@/components/MediaElement.vue'
import MediaUploadInput from '../media/MediaUploadInput.vue'

export default defineComponent({
  components: {
    Draggable,
    MediaEditForm,
    MediaElement,
    MediaUploadInput,
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
  padding-top: 12px;

  // &__upload-btn {
  // }

  &__info-text {
    display: block;
    color: var(--gray-color-600);
    text-align: center;
    font-size: 0.8em;
    letter-spacing: 0.55px;
    margin: 16px 0 12px;
  }

  &__images {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
  }

  &__img {
    position: relative;
    width: 100%;
    padding-top: 100%;
    background-color: var(--white-color);
    box-shadow: $shadow;
    border-radius: 4px;
    cursor: move;

    .media-element {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      background-color: var(--white-color);
      border-radius: 4px;
      overflow: hidden;
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
    right: 18px;
  }

  &__img:hover &__remove-img,
  &__img:hover &__edit-img {
    top: -10px;
    visibility: visible;
    opacity: 1;
  }
}
</style>

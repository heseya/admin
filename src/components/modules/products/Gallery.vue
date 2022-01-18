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
        <div class="remove">
          <icon-button v-if="!disabled" type="danger" @click="onImageDelete(image.id)">
            <template #icon>
              <i class="bx bx-trash"></i>
            </template>
          </icon-button>
        </div>
      </div>
      <app-media-uploader
        v-if="!disabled"
        class="gallery__img gallery__add undragabble"
        :class="{ 'add--drag': isDrag, 'add--big': images.length === 0 }"
        multiple
        @dragChange="dragChange"
        @upload="onImageUpload"
        @error="onUploadError"
      >
        <img src="@/assets/images/icons/plus-icon.svg" />
      </app-media-uploader>
    </draggable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'

import MediaUploader from '@/components/MediaUploader.vue'
import { formatApiNotificationError } from '@/utils/errors'
import { UUID } from '@/interfaces/UUID'
import { CdnMedia, CdnMediaType } from '@/interfaces/Media'
import { removeMedia } from '@/services/uploadMedia'
import MediaElement from '@/components/MediaElement.vue'

export default Vue.extend({
  components: {
    appMediaUploader: MediaUploader,
    Draggable,
    MediaElement,
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
    isDrag: false,
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
    dragChange(isDrag: boolean) {
      this.isDrag = isDrag
    },
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
    onUploadError(error: any) {
      this.$toast.error(formatApiNotificationError(error))
    },
    clearMediaToDelete() {
      this.mediaToDelete = []
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

    .remove {
      position: absolute;
      top: -15px;
      right: -10px;
      transition: 0.3s;
      visibility: hidden;
      opacity: 0;
    }

    &:hover .remove {
      top: -10px;
      visibility: visible;
      opacity: 1;
    }
  }

  &__add {
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
  }

  .loading {
    &::before {
      content: '';
      position: absolute;
      box-sizing: border-box;
      display: block;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      height: 20%;
      width: 20%;
      animation: spin 1s infinite;
      background-color: transparent;
      border: 6px solid #ffffff;
      border-color: #ffffff transparent transparent transparent;
      box-shadow: none;
      z-index: 4;
    }

    img {
      filter: blur(4px);
      transform: scale(1.1);
    }
  }
}
</style>

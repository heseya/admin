<template>
  <div class="gallery">
    <draggable
      class="gallery__images"
      v-model="images"
      :options="{ filter: '.undragabble' }"
      :disabled="disabled"
    >
      <div class="gallery__img" v-for="image in images" :key="image.url">
        <img :src="`${image.url}?w=350&h=350`" :style="{ objectFit }" />
        <div class="remove">
          <vs-button v-if="!disabled" icon color="danger" @click="onImageDelete(image.id)">
            <i class="bx bx-trash"></i>
          </vs-button>
        </div>
      </div>
      <app-media-uploader
        v-if="!disabled"
        @dragChange="dragChange"
        @upload="onImageUpload"
        @error="onUploadError"
        class="gallery__img add undragabble"
        :class="{ 'add--drag': isDrag, 'add--big': images.length === 0 }"
      >
        <img src="/img/icons/plus.svg" />
      </app-media-uploader>
    </draggable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'

import MediaUploader from '@/components/MediaUploader.vue'
import { formatApiError } from '@/utils/errors'
import { UUID } from '@/interfaces/UUID'
import { CdnMedia } from '@/interfaces/Media'
import { removeMedia } from '@/services/uploadMedia'

export default Vue.extend({
  components: {
    appMediaUploader: MediaUploader,
    Draggable,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<CdnMedia[]>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    images: {
      get(): CdnMedia[] {
        return this.value
      },
      set(val: CdnMedia[]) {
        this.$emit('input', val)
      },
    },
    objectFit() {
      return +this.$accessor.env.dashboard_products_contain ? 'contain' : 'cover'
    },
  },
  mounted() {
    window.addEventListener('beforeunload', this.removeTouchedFiles)
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.removeTouchedFiles)
    this.removeTouchedFiles()
  },
  data: () => ({
    mediaToDelete: [] as UUID[],
    isDrag: false,
  }),
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
      this.$vs.notification({
        color: 'danger',
        ...formatApiError(error),
      })
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
    background-color: #fff;
    border-radius: 20px;
    box-shadow: $shadow;

    img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      background-color: #fff;
      border-radius: 20px;
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

  .add {
    // width: 25%;
    // padding-top: 25%;
    // margin-top: 10px;

    &--big {
      width: 50%;
      padding-top: 50%;
      margin-top: 0;
    }

    img {
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
      border: 6px solid #fff;
      border-color: #fff transparent transparent transparent;
      box-shadow: none;
      z-index: 4;
    }

    img {
      filter: blur(4px);
      transform: scale(1.1);
    }
  }

  @keyframes spin {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
}
</style>

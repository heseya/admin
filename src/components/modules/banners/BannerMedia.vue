<template>
  <div class="responsive-media">
    <div class="responsive-media__drag" :title="$t('dragTitle')">
      <i class="bx bx-grid-vertical"></i>
    </div>

    <div class="responsive-media__content">
      <div class="responsive-media__inputs">
        <validated-input
          v-model="bannerMedia.title"
          :label="$t('form.title')"
          :disabled="disabled"
          rules="required"
        />
        <validated-input
          v-model="bannerMedia.subtitle"
          :label="$t('form.subtitle')"
          :disabled="disabled"
          rules="required"
        />

        <validated-input v-model="bannerMedia.url" :disabled="disabled" rules="required">
          <template #label>
            {{ $t('form.url') }}
            <info-tooltip> {{ $t('form.urlTooltip') }}</info-tooltip>
          </template>
        </validated-input>
      </div>

      <div class="responsive-media__media-list">
        <div v-for="(image, i) in bannerMedia.media" :key="image.media.id" class="item-wrapper">
          <div class="single-media">
            <media-element :media="image.media" :size="120" fit="contain" />
            <div class="single-media__remove-img">
              <icon-button v-if="!disabled" type="danger" @click="onMediaDelete(i)">
                <template #icon>
                  <i class="bx bx-trash"></i>
                </template>
              </icon-button>
            </div>

            <media-edit-form
              class="single-media__edit-img"
              :disabled="disabled"
              :media="image.media"
              @updated="(m) => updateMedia(m, i)"
            />

            <validated-input
              v-model="image.min_screen_width"
              class="single-media__input"
              type="number"
              :label="$t('minWidth')"
            />
          </div>
        </div>

        <div class="item-wrapper">
          <gallery-upload-button @upload="onImageUpload" />
        </div>
      </div>
    </div>

    <div class="responsive-media__buttons">
      <icon-button size="small" type="danger" :disabled="disabled" @click="$emit('delete')">
        <template #icon>
          <i class="bx bx-trash"></i>
        </template>
      </icon-button>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "dragTitle": "Przeciągnij zdjęcia",
    "minWidth": "Minimalna szerokość ekranu",
    "form": {
      "title": "Tytuł grafiki",
      "subtitle": "Podtytuł grafiki",
      "url": "Adres przekierowania",
      "urlTooltip": "Adres do którego banner przekieruje po kliknięciu, może być absolutny lub relatywny"
    }
  },
  "en": {
    "dragTitle": "Drag images",
    "minWidth": "Minimal screen width",
    "form": {
      "title": "Title",
      "subtitle": "Subtitle",
      "url": "Redirection url",
      "urlTooltip": "Addres to which banner will redirect after clicking, can be absolute or relative"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { BannerMedia, CdnMedia } from '@heseya/store-core'

import { removeMedia } from '@/services/uploadMedia'
import MediaElement from '@/components/MediaElement.vue'
import GalleryUploadButton from '../products/GalleryUploadButton.vue'
import MediaEditForm from '../media/MediaEditForm.vue'

export default Vue.extend({
  components: { MediaElement, GalleryUploadButton, MediaEditForm },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<BannerMedia>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    mediaToDelete: [] as string[],
  }),

  computed: {
    bannerMedia: {
      get(): BannerMedia {
        return this.value
      },
      set(v: BannerMedia) {
        this.$emit('input', v)
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
    updateMedia(media: CdnMedia, index: number) {
      this.bannerMedia.media[index].media = media
    },

    onMediaDelete(i: number) {
      const deletedId = this.bannerMedia.media[i].media.id
      this.bannerMedia.media = this.bannerMedia.media.filter((_, index) => index !== i)

      if (this.mediaToDelete.find((id) => deletedId === id)) {
        this.mediaToDelete = this.mediaToDelete.filter((id) => deletedId !== id)
        removeMedia(deletedId)
      }
    },

    onImageUpload(media: CdnMedia) {
      this.bannerMedia.media.push({ min_screen_width: 0, media })
      this.mediaToDelete = [...this.mediaToDelete, media.id]
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

<style lang="scss" scoped>
$item-size: 160px;

.responsive-media {
  display: flex;
  justify-content: space-between;
  transition: 0.1s;
  border-radius: 16px;

  &:hover {
    background-color: rgba($background-color-700, 0.4);
  }

  &__content {
    width: 100%;
  }

  &__inputs {
    display: grid;
    grid-gap: 16px;
    padding-top: 8px;

    @media ($viewport-6) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  &__media-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, $item-size);
    grid-gap: 8px;
    padding: 8px;
    width: 100%;
  }

  &__drag {
    align-self: stretch;
    cursor: move;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $gray-color-500;
  }

  &__buttons {
    align-self: flex-start;
    padding: 8px;
  }
}

.item-wrapper {
  width: $item-size;
}

.single-media {
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

  &:hover &__remove-img,
  &:hover &__edit-img {
    top: -10px;
    visibility: visible;
    opacity: 1;
  }

  &__input {
    position: absolute;
    left: 4px;
    bottom: 4px;
    width: calc(100% - 8px);
    color: #fff;
    text-shadow: 0px 0px 8px $font-color;

    ::v-deep .app-input {
      margin-bottom: 0;
    }
  }
}
</style>

<template>
  <div class="responsive-media" :class="{ 'responsive-media--no-hover': static }">
    <div
      v-if="!static"
      class="responsive-media__drag reorder-handle"
      :title="$t('dragTitle').toString()"
    >
      <i class="bx bx-grid-vertical"></i>
    </div>

    <div class="responsive-media__content">
      <div class="responsive-media__inputs">
        <validated-input
          v-model="bannerTitle"
          :label="$t('form.title').toString()"
          :disabled="disabled"
        />
        <validated-input
          v-model="bannerSubtitle"
          :label="$t('form.subtitle').toString()"
          :disabled="disabled"
        />

        <validated-input v-model="bannerUrl" :disabled="disabled">
          <template #label>
            {{ $t('form.url') }}
            <info-tooltip> {{ $t('form.urlTooltip') }}</info-tooltip>
          </template>
        </validated-input>
      </div>

      <div :key="bannerMedia.media.length" class="responsive-media__media-list">
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
              :label="$t('minWidth').toString()"
            />
          </div>
        </div>

        <div class="item-wrapper">
          <media-upload-input :disabled="disabled" @upload="onImageUpload" />
        </div>
      </div>
      <PublishedLangsForm v-if="!static" v-model="bannerMedia.published" slim />
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
import { defineComponent, PropType } from 'vue'
import { CdnMedia } from '@heseya/store-core'

import { removeMedia } from '@/services/uploadMedia'

import MediaElement from '@/components/MediaElement.vue'
import MediaEditForm from '../media/MediaEditForm.vue'
import MediaUploadInput from '../media/MediaUploadInput.vue'

import { BannerMediaComponentForm } from '@/interfaces/Banner'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'

export default defineComponent({
  components: { MediaElement, MediaEditForm, MediaUploadInput, PublishedLangsForm },
  props: {
    value: {
      type: Object as PropType<BannerMediaComponentForm>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    editedLang: {
      type: String,
      required: true,
    },
    static: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    mediaToDelete: [] as string[],
  }),

  computed: {
    bannerMedia: {
      get(): BannerMediaComponentForm {
        return this.value
      },
      set(v: BannerMediaComponentForm) {
        this.$emit('input', v)
      },
    },

    bannerUrl: {
      get(): string {
        return this.bannerMedia.url || ''
      },
      set(value: string) {
        this.$emit('input', { ...this.bannerMedia, url: value })
      },
    },
    bannerTitle: {
      get(): string {
        return this.bannerMedia.translations[this.editedLang]?.title || ''
      },
      set(value: string) {
        this.bannerMedia.translations[this.editedLang].title = value
      },
    },
    bannerSubtitle: {
      get(): string {
        return this.bannerMedia.translations[this.editedLang]?.subtitle || ''
      },
      set(value: string) {
        this.bannerMedia.translations[this.editedLang].subtitle = value
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
      this.bannerMedia = {
        ...this.bannerMedia,
        media: this.bannerMedia.media.filter((_, index) => index !== i),
      }

      if (this.mediaToDelete.find((id) => deletedId === id)) {
        this.mediaToDelete = this.mediaToDelete.filter((id) => deletedId !== id)
        removeMedia(deletedId)
      }
    },

    onImageUpload(media: CdnMedia) {
      this.bannerMedia = {
        ...this.bannerMedia,
        media: [...this.bannerMedia.media, { min_screen_width: 0, media }],
      }

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

  &:not(&--no-hover):hover {
    // background-color: rgba(var(--background-color-700), 0.4);
    background-color: var(--background-color-500);
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
    color: var(--gray-color-500);
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
  background-color: var(--white-color);
  box-shadow: $shadow;
  border-radius: 7px;

  .media-element {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    background-color: var(--white-color);
    border-radius: 7px;
    overflow: hidden;
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
    color: var(--white-color);
    text-shadow: 0px 0px 8px var(--font-color);

    :deep(.app-input) {
      margin-bottom: 0;
    }
  }
}
</style>

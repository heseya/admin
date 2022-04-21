<template>
  <div class="responsive-media">
    <div class="responsive-media__drag" :title="$t('dragTitle')">
      <i class="bx bx-grid-vertical"></i>
    </div>

    <div class="responsive-media__content">
      <div v-for="(image, i) in media" :key="image.media.id" class="item-wrapper">
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
            @update="(m) => updateMedia(m, i)"
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

    <div class="responsive-media__buttons">
      <icon-button size="small" type="danger" :disabled="disabled" @click="$emit('delete')">
        <template #icon>
          <i class="bx bx-trash"></i>
        </template>
      </icon-button>
    </div>
  </div>
</template>

<i18n>
{
  "pl": {
    "dragTitle": "Przeciągnij zdjęcia",
    "minWidth": "Minimalna szerokość ekranu"
  },
  "en": {
    "dragTitle": "Drag images",
    "minWidth": "Minimal screen width"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { ResponsiveMedia } from '@/interfaces/Banner'
import { CdnMedia } from '@/interfaces/Media'
import MediaElement from '@/components/MediaElement.vue'

import GalleryUploadButton from '../products/GalleryUploadButton.vue'
import MediaEditForm from '../media/MediaEditForm.vue'

export default Vue.extend({
  components: { MediaElement, GalleryUploadButton, MediaEditForm },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ResponsiveMedia>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    media: {
      get(): ResponsiveMedia {
        return this.value
      },
      set(v: ResponsiveMedia) {
        this.$emit('input', v)
      },
    },
  },

  methods: {
    updateMedia(media: CdnMedia, index: number) {
      this.media[index].media = media
    },

    onMediaDelete(i: number) {
      this.media = this.media.filter((_, index) => index !== i)
    },

    onImageUpload(media: CdnMedia) {
      this.media.push({ min_screen_width: 0, media })
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
    left: 0;
    bottom: 0;
    width: 100%;
    color: #fff;
    text-shadow: 0px 0px 4px $font-color;

    ::v-deep .app-input {
      margin-bottom: 0;
    }
  }
}
</style>

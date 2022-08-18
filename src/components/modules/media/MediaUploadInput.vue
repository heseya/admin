<template>
  <div class="media-upload-input-wrapper">
    <span class="media-upload-input-wrapper__label">{{ label }}</span>
    <media-uploader
      class="media-upload-input"
      :class="{ 'media-upload-input--image': !!image, 'media-upload-input--drag': isDrag }"
      :disabled="disabled || !!image"
      @upload="(f) => $emit('upload', f)"
      @drag-change="(v) => (isDrag = v)"
    >
      <template v-if="image">
        <img class="media-upload-input__img" :src="image.url" role="presentation" />

        <AppButton
          type="danger"
          size="small"
          class="media-upload-input__delete"
          @click.prevent.stop="$emit('upload', undefined)"
        >
          {{ $t('removeOrChangeImage') }}
        </AppButton>

        <media-edit-form
          class="media-upload-input__edit-img"
          :disabled="disabled"
          :media="image"
          placement="top"
          @update="updateMedia"
        />
      </template>
      <template v-else>
        <div class="media-upload-input__circle">
          <img :src="iconPath" :alt="$t('fileAdd')" class="media-upload-input__file-add" />
        </div>
        <span class="media-upload-input__title"
          >{{ $t('dropOrChooseImage') }} <b>{{ fileName }}</b></span
        >
      </template>
    </media-uploader>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "removeOrChangeImage": "Usuń lub zmień zdjęcie",
    "dropOrChooseImage": "Przeciągnij lub kliknij aby dodać",
    "defaultFileName": "multimedia",
    "chooseImage": "Wybierz zdjęcie",
    "fileAdd": "Dodaj zdjęcie"
  },
  "en": {
    "removeOrChangeImage": "Remove or change image",
    "dropOrChooseImage": "Drop or choose image to add",
    "defaultFileName": "media",
    "chooseImage": "Choose image",
    "fileAdd": "Add file"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { CdnMedia } from '@heseya/store-core'

import MediaEditForm from '@/components/modules/media/MediaEditForm.vue'
import MediaUploader from '@/components/modules/media/MediaUploader.vue'

export default Vue.extend({
  components: { MediaUploader, MediaEditForm },
  props: {
    image: {
      type: Object,
      default: () => null,
    } as Vue.PropOptions<CdnMedia>,
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    iconPath: {
      type: String,
      default: () => require('@/assets/images/icons/file-add.svg'),
    },
    fileName: {
      type: String,
      default: function () {
        return this.$t('defaultFileName')
      },
    },
  },
  data: () => ({
    isDrag: false,
  }),
  methods: {
    updateMedia(media: CdnMedia) {
      this.$emit('upload', media)
    },
  },
})
</script>

<style lang="scss" scoped>
.media-upload-input-wrapper {
  position: relative;
  height: 100%;

  &__label {
    margin-bottom: 3px;
    font-size: 0.8em;
  }
}

.media-upload-input {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 16px;
  border: 1px dashed #ddd;
  position: relative;
  background-color: #f7f7f8;
  border-radius: 4px;
  height: 100%;
  transition: 0.3s;

  &__img {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }

  &--image {
    background-color: #eee;
    cursor: default;
  }

  &__title {
    display: block;
    margin: 12px 0;
    color: #979ea0;
    font-size: 11px;
    text-align: center;
  }

  &__delete,
  &__edit-img {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
  }

  &__delete {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &__edit-img {
    left: 50%;
    bottom: 32px;
    transform: translateX(-50%);
  }

  &__circle {
    display: flex;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: none;
    background-color: #fff;
    cursor: pointer;
    transition: 0.3s;
  }

  &__file-add {
    min-height: auto !important;
    height: 24px;
    width: 24px;
    margin: auto;
    transition: 0.3s;
  }

  &--drag &__delete,
  &:hover &__delete,
  &--drag &__edit-img,
  &:hover &__edit-img {
    opacity: 1;
    visibility: visible;
  }

  &--drag &__circle,
  &:hover &__circle {
    transform: scale(1.1);
  }
}

.media-upload-input-wrapper:hover .media-upload-input__edit-img {
  opacity: 1;
  visibility: visible;
}
</style>

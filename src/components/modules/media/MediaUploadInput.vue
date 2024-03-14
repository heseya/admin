<template>
  <div class="media-upload-input-wrapper">
    <span class="media-upload-input-wrapper__label">{{ label }}</span>
    <media-uploader
      v-slot="{ loading }"
      class="media-upload-input"
      :class="{ 'media-upload-input--image': !!media, 'media-upload-input--drag': isDrag }"
      :disabled="disabled || !!media"
      @upload="(f) => $emit('upload', f)"
      @drag-change="(v) => (isDrag = v)"
    >
      <template v-if="media">
        <media-element :media="media" class="media-upload-input__media" />

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
          :media="media"
          placement="top"
          @updated="updateMedia"
        />
      </template>
      <template v-else>
        <div class="media-upload-input__circle">
          <img
            :src="iconPath"
            :alt="$t('fileAdd').toString()"
            class="media-upload-input__file-add"
          />
          <Loading class="media-upload-input__loading" :active="loading" />
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
    "removeOrChangeImage": "Usuń lub zmień multimedia",
    "dropOrChooseImage": "Przeciągnij lub kliknij aby dodać",
    "defaultFileName": "multimedia",
    "chooseImage": "Wybierz multimedia",
    "fileAdd": "Dodaj multimedia"
  },
  "en": {
    "removeOrChangeImage": "Remove or change multimedia",
    "dropOrChooseImage": "Drop or choose multimedia to add",
    "defaultFileName": "media",
    "chooseImage": "Choose multimedia",
    "fileAdd": "Add file"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { CdnMedia } from '@heseya/store-core'

import MediaEditForm from '@/components/modules/media/MediaEditForm.vue'
import MediaUploader from '@/components/modules/media/MediaUploader.vue'
import MediaElement from '@/components/MediaElement.vue'
import Loading from '@/components/layout/Loading.vue'

export default defineComponent({
  components: { MediaUploader, MediaEditForm, MediaElement, Loading },
  props: {
    media: {
      type: Object as PropType<CdnMedia>,
      default: () => null,
    },
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
      default: () => '/img/icons/file-add.svg',
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
  border: 1px dashed var(--gray-color-300);
  position: relative;
  background-color: var(--background-color-500);
  border-radius: 4px;
  height: 100%;
  min-height: 100px;
  max-height: 100%;
  transition: 0.3s;

  &__media {
    display: block;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    z-index: 1;
  }

  &--image {
    background-color: var(--gray-color-300);
    cursor: default;
  }

  &__title {
    display: block;
    margin: 12px 0;
    color: var(--gray-color-400);
    font-size: 11px;
    text-align: center;
  }

  &__delete,
  &__edit-img {
    position: absolute;
    z-index: 10;
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
    right: 16px;
    top: 16px;
  }

  &__circle {
    display: flex;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    position: relative;
    border: none;
    background-color: var(--white-color);
    cursor: pointer;
    transition: 0.3s;
  }

  &__loading {
    border-radius: 50%;
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

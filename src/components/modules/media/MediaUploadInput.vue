<template>
  <div class="media-upload-input-wrapper">
    <span class="media-upload-input-wrapper__label">{{ label }}</span>
    <media-uploader
      class="media-upload-input"
      :class="{ 'media-upload-input--image': !!image }"
      :disabled="disabled || !!image"
      @upload="(f) => $emit('upload', f)"
    >
      <template v-if="image">
        <img :src="image.url" role="presentation" />

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
        <span class="media-upload-input__title">{{ $t('dropOrChooseImage') }}</span>
        <AppButton type="primary" @click.prevent>
          <i class="bx bx-upload"></i> {{ $t('chooseImage') }}
        </AppButton>
      </template>
    </media-uploader>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "removeOrChangeImage": "Usuń lub zmień zdjęcie",
    "dropOrChooseImage": "Upuść lub wybierz zdjęcie",
    "chooseImage": "Wybierz zdjęcie"
  },
  "en": {
    "removeOrChangeImage": "Remove or change image",
    "dropOrChooseImage": "Drop or choose image",
    "chooseImage": "Choose image"
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
  },
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

  img {
    display: block;
    max-height: 240px;
    min-height: 150px;
  }

  &--image {
    background-color: #eee;
    cursor: default;
  }

  &__title {
    display: block;
    font-weight: 600;
    margin-bottom: 12px;
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
  }

  &__edit-img {
    left: 50%;
    bottom: 32px;
    transform: translateX(-50%);
  }

  &:hover &__delete,
  &:hover &__edit-img {
    opacity: 1;
    visibility: visible;
  }
}

.media-upload-input-wrapper:hover .media-upload-input__edit-img {
  opacity: 1;
  visibility: visible;
}
</style>

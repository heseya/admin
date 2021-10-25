<template>
  <div class="media-upload-input-wrapper">
    <span class="media-upload-input-wrapper__label">{{ label }}</span>
    <media-uploader
      class="media-upload-input"
      :class="{ 'media-upload-input--image': !!image }"
      :disabled="disabled"
      @upload="(f) => $emit('upload', f)"
    >
      <template v-if="image">
        <img :src="image.url" role="presentation" />
        <AppButton
          type="danger"
          size="small"
          class="media-upload-input__delete"
          @click.stop="$emit('upload', undefined)"
        >
          Usuń lub zmień zdjęcie
        </AppButton>
      </template>
      <template v-else>
        <span class="media-upload-input__title">Upuść lub wybierz zdjęcie</span>
        <AppButton type="primary"><i class="bx bx-upload"></i> Wybierz zdjęcie</AppButton>
      </template>
    </media-uploader>
  </div>
</template>

<script lang="ts">
import { CdnMedia } from '@/interfaces/Media'
import Vue from 'vue'
import MediaUploader from './MediaUploader.vue'
export default Vue.extend({
  components: { MediaUploader },
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
})
</script>

<style lang="scss" scoped>
.media-upload-input-wrapper {
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
    max-height: 200px;
  }

  &--image {
    background-color: #eee;
  }

  &__delete {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    visibility: none;
    transition: 0.3s;
  }

  &:hover &__delete {
    opacity: 1;
    visibility: visible;
  }

  &__title {
    display: block;
    font-weight: 600;
    margin-bottom: 12px;
  }
}
</style>

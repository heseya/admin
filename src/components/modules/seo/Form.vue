<template>
  <modal-form class="seo-form">
    <validated-input v-model="form.title" :disabled="disabled" label="Tytuł strony" />
    <validated-input v-model="form.description" :disabled="disabled" label="Opis strony" />
    <app-select v-model="form.keywords" label="Słowa kluczowe" :disabled="disabled" mode="tags" />

    <app-select v-model="form.twitter_card" label="Typ kart Twittera" :disabled="disabled">
      <a-select-option value="summary"> Podsumowanie (<code>summary</code>) </a-select-option>
      <a-select-option value="summary_large_image">
        Podsumowanie z dużym zdjęciem (<code>summary_large_image</code>)
      </a-select-option>
    </app-select>

    <media-upload-input
      label="Zdjęcie udostępniania w mediach społecznościowych"
      :disabled="disabled"
      :image="form.og_image"
      @upload="changeMedia"
    />
  </modal-form>
</template>

<script lang="ts">
import Vue from 'vue'

import ModalForm from '@/components/form/ModalForm.vue'

import { SeoMetadata, SeoMetadataDto, TwitterCardType } from '@/interfaces/SeoMetadata'
import { CdnMedia } from '@/interfaces/Media'
import MediaUploadInput from '@/components/MediaUploadInput.vue'

const CLEAR_FORM: SeoMetadata & SeoMetadataDto = {
  title: '',
  description: '',
  keywords: [],
  twitter_card: TwitterCardType.Summary,
  og_image: undefined,
  og_image_id: undefined,
}

export default Vue.extend({
  components: {
    ModalForm,
    MediaUploadInput,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<SeoMetadata>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): SeoMetadata {
        return this.value
      },
      set(v: SeoMetadata) {
        this.$emit('input', { ...CLEAR_FORM, ...v })
      },
    },
  },

  created() {
    this.form = { ...CLEAR_FORM, ...this.form }
  },

  methods: {
    changeMedia(media: CdnMedia) {
      this.form.og_image = media
      this.form.og_image_id = media.id
    },
  },
})
</script>

<style lang="scss" scoped>
.seo-form {
  &__og-image {
  }
}
</style>

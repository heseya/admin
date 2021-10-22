<template>
  <modal-form class="seo-form">
    <validated-input v-model="form.title" :disabled="disabled" label="Tytuł strony" />
    <validated-input v-model="form.description" :disabled="disabled" label="Opis strony" />
    <validated-input v-model="form.keywords" :disabled="disabled" label="Słowa kluczowe" />
    <validated-input v-model="form.twitter_card" :disabled="disabled" label="twitter_card" />

    <media-uploader class="seo-form__og-image" :disabled="disabled" @upload="changeMedia">
      <template v-if="!form.og_image">
        <img src="@/assets/images/heseya.svg" alt="Heseya" />
        <span v-if="!disabled">Dodaj swoje logo</span>
      </template>
      <template v-else>
        <img :src="form.og_image.url" alt="OG image" />
        <span v-if="!disabled">Zmień swoje logo</span>
      </template>
    </media-uploader>
  </modal-form>
</template>

<script lang="ts">
import Vue from 'vue'

import ModalForm from '@/components/form/ModalForm.vue'

import { SeoMetadata } from '@/interfaces/SeoMetadata'
import { CdnMedia } from '@/interfaces/Media'
import MediaUploader from '@/components/MediaUploader.vue'

export default Vue.extend({
  components: {
    ModalForm,
    MediaUploader,
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
        this.$emit('input', v)
      },
    },
  },
  methods: {
    changeMedia(media: CdnMedia) {
      this.form.og_image = media
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

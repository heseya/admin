<template>
  <modal-form class="seo-form">
    <validated-input v-model="form.title" :disabled="disabled" label="Tytuł strony" />
    <small class="seo-form__subtext">
      Ilość znaków: {{ form.title ? form.title.length : 0 }}
      <a-tooltip>
        <template #title> Zalecana maksymalna długość tytułu to 70 znaków </template>
        <i class="bx bxs-info-circle"></i>
      </a-tooltip>
    </small>

    <validated-input v-model="form.description" :disabled="disabled" label="Opis strony" />
    <small class="seo-form__subtext">
      Ilość znaków: {{ form.description ? form.description.length : 0 }}
      <a-tooltip>
        <template #title> Zalecana maksymalna długość opisu to 160 znaków </template>
        <i class="bx bxs-info-circle"></i>
      </a-tooltip>
    </small>

    <app-select
      :value="form.keywords || []"
      label="Słowa kluczowe"
      :disabled="disabled"
      mode="tags"
      @input="(v) => (form.keywords = v)"
    />

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

type SeoMeta = SeoMetadata & SeoMetadataDto

const CLEAR_FORM: SeoMeta = {
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
    } as Vue.PropOptions<SeoMeta>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): SeoMeta {
        return this.value
      },
      set(v: SeoMeta) {
        this.$emit('input', v)
      },
    },
  },

  created() {
    this.form = {
      title: this.form.title || CLEAR_FORM.title,
      description: this.form.description || CLEAR_FORM.description,
      keywords: this.form.keywords || CLEAR_FORM.keywords,
      og_image: this.form.og_image || CLEAR_FORM.og_image,
      og_image_id: this.form.og_image?.id || CLEAR_FORM.og_image_id,
      twitter_card: this.form.twitter_card || CLEAR_FORM.twitter_card,
    }
  },

  methods: {
    changeMedia(media: CdnMedia | undefined) {
      this.form.og_image = media
      this.form.og_image_id = media?.id || null
    },
  },
})
</script>

<style lang="scss" scoped>
.seo-form {
  &__og-image {
  }

  &__subtext {
    display: block;
    text-align: right;
    margin-top: -6px;
    margin-bottom: 4px;
    font-size: 0.6rem;
    color: #999;

    i {
      color: $blue-color-400;
      font-size: 1.1em;
      transform: translateY(1px);
    }
  }
}
</style>

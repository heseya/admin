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

    <switch-input v-if="!forceIndex" v-model="form.no_index" :disabled="disabled" type="red">
      <template #title>
        Wyłącz indeksowanie podstrony
        <a-tooltip>
          <template #title>
            Wyłączenie indeksowanie strony zapobiegnie wyświetlaniu strony w wynikach wyszukiwania
            (np. Google).
          </template>
          <i class="seo-form__switch-tooltip-icon bx bxs-info-circle"></i>
        </a-tooltip>
      </template>
      <template #checkedChildren> <i class="bx bxs-low-vision"></i> </template>
      <template #unCheckedChildren> <i class="bx bx-show"></i> </template>
    </switch-input>

    <app-select
      :value="form.keywords || []"
      label="Słowa kluczowe"
      :disabled="disabled"
      mode="tags"
      @input="(v) => (form.keywords = v)"
    />

    <a-alert v-if="duplicatedKeywordsItem" type="warning" show-icon style="margin-bottom: 1rem">
      <template #message>
        Słowa kluczowe podane powyżej duplikują słowa kluczowe w
        <a :href="duplicatedKeywordUrl" target="_blank">innym elemencie</a>. Rozważ ich zmianę, aby
        osiągnąć lepsze rezultaty SEO.
      </template>
    </a-alert>

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

export const CLEAR_SEO_FORM: SeoMeta = {
  title: '',
  description: '',
  keywords: [],
  twitter_card: TwitterCardType.Summary,
  og_image: undefined,
  og_image_id: undefined,
  no_index: false,
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
    forceIndex: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    duplicatedKeywordsItem: null as null | {
      // eslint-disable-next-line camelcase
      model_type: 'Product' | 'ProductSet' | 'Page'
      id: string
    },
  }),

  computed: {
    form: {
      get(): SeoMeta {
        return this.value
      },
      set(v: SeoMeta) {
        this.$emit('input', v)
      },
    },
    duplicatedKeywordUrl(): string | null {
      switch (this.duplicatedKeywordsItem?.model_type) {
        case 'Product':
          return `/products/${this.duplicatedKeywordsItem.id}`
        case 'ProductSet':
          return `/collections?open=${this.duplicatedKeywordsItem.id}`
        case 'Page':
          return `/pages/${this.duplicatedKeywordsItem.id}`
        default:
          return null
      }
    },
  },

  watch: {
    'form.keywords': {
      handler(keywords: string[]) {
        if (keywords.length) {
          this.checkDuplicates(keywords)
        }
      },
      deep: true,
    },
  },

  created() {
    this.form = {
      title: this.form.title || CLEAR_SEO_FORM.title,
      description: this.form.description || CLEAR_SEO_FORM.description,
      keywords: this.form.keywords || CLEAR_SEO_FORM.keywords,
      og_image: this.form.og_image || CLEAR_SEO_FORM.og_image,
      og_image_id: this.form.og_image?.id || CLEAR_SEO_FORM.og_image_id,
      twitter_card: this.form.twitter_card || CLEAR_SEO_FORM.twitter_card,
      no_index: this.form.no_index || CLEAR_SEO_FORM.no_index,
    }
  },

  methods: {
    changeMedia(media: CdnMedia | undefined) {
      this.form.og_image = media
      this.form.og_image_id = media?.id || null
    },

    async checkDuplicates(keywords: string[]) {
      const { duplicates } = await this.$accessor.globalSeo.checkDuplicates(keywords)
      this.duplicatedKeywordsItem = duplicates[0] || null
    },
  },
})
</script>

<style lang="scss" scoped>
.seo-form {
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

  &__switch-tooltip-icon {
    color: $blue-color-400;
  }
}
</style>

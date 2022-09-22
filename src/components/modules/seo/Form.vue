<template>
  <modal-form class="seo-form">
    <validated-input v-model="form.title" :disabled="disabled" :label="$t('form.title')" />
    <small class="seo-form__subtext">
      {{ $t('charsCount') }}: {{ form.title ? form.title.length : 0 }}
      <info-tooltip>
        {{ $t('titleCharsRecomendation') }}
      </info-tooltip>
    </small>

    <validated-input
      v-model="form.description"
      :disabled="disabled"
      :label="$t('form.description')"
    />
    <small class="seo-form__subtext">
      {{ $t('charsCount') }}: {{ form.description ? form.description.length : 0 }}
      <info-tooltip>
        {{ $t('descriptionCharsRecomendation') }}
      </info-tooltip>
    </small>

    <switch-input v-if="!forceIndex" v-model="form.no_index" :disabled="disabled" type="red">
      <template #title>
        {{ $t('form.no_index') }}
        <info-tooltip icon="seo-form__switch-tooltip-icon bx bxs-info-circle">
          {{ $t('noIndexTooltip') }}
        </info-tooltip>
      </template>
      <template #checkedChildren> <i class="bx bxs-low-vision"></i> </template>
      <template #unCheckedChildren> <i class="bx bx-show"></i> </template>
    </switch-input>

    <app-select
      :value="form.keywords || []"
      :label="$t('form.keywords')"
      :disabled="disabled"
      mode="tags"
      @input="(v) => (form.keywords = v)"
    />

    <a-alert v-if="duplicatedKeywordsItem" type="warning" show-icon style="margin-bottom: 1rem">
      <template #message>
        {{ $t('duplicatedKeywords.text1') }}
        <a :href="duplicatedKeywordUrl" target="_blank">{{ $t('duplicatedKeywords.link') }}</a
        >. {{ $t('duplicatedKeywords.text2') }}
      </template>
    </a-alert>

    <app-select v-model="form.twitter_card" :label="$t('form.twitter_card')" :disabled="disabled">
      <a-select-option value="summary">
        {{ $t('form.twitter.summary') }} (<code>{{ 'summary' }}</code
        >)
      </a-select-option>
      <a-select-option value="summary_large_image">
        {{ $t('form.twitter.summary_large_image') }} (<code>{{ 'summary_large_image' }}</code
        >)
      </a-select-option>
    </app-select>

    <media-upload-input
      :label="$t('form.og_image')"
      :disabled="disabled"
      :image="form.og_image"
      @upload="changeMedia"
    />
  </modal-form>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "title": "Tytuł strony",
      "description": "Opis strony",
      "no_index": "Wyłącz indeksowanie podstrony",
      "keywords": "Słowa kluczowe",
      "twitter_card": "Typ kart Twittera",
      "twitter": {
        "summary": "Podsumowanie",
        "summary_large_image": "Podsumowanie z dużym zdjęciem"
      },
      "og_image": "Zdjęcie udostępniania w mediach społecznościowych"
    },
    "charsCount": "Ilość znaków",
    "titleCharsRecomendation": "Zalecana maksymalna długość tytułu to 70 znaków",
    "descriptionCharsRecomendation": "Zalecana maksymalna długość opisu to 160 znaków",
    "noIndexTooltip": "Wyłączenie indeksowanie strony zapobiegnie wyświetlaniu strony w wynikach wyszukiwania (np. Google).",
    "duplicatedKeywords": {
      "text1": "Słowa kluczowe podane powyżej duplikują słowa kluczowe w",
      "link": "innym elemencie",
      "text2": "Rozważ ich zmianę, aby osiągnąć lepsze rezultaty SEO."
    }
  },
  "en": {
    "form": {
      "title": "Page title",
      "description": "Page description",
      "no_index": "Disable page indexing",
      "keywords": "Keywords",
      "twitter_card": "Twitter card type",
      "twitter": {
        "summary": "Summary",
        "summary_large_image": "Summary with large image"
      },
      "og_image": "Social media share image"
    },
    "charsCount": "Chars count",
    "titleCharsRecomendation": "Recommended max length of title is 70 chars",
    "descriptionCharsRecomendation": "Recommended max length of description is 160 chars",
    "noIndexTooltip": "Disabling page indexing will prevent it from appearing in search results (eg. Google).",
    "duplicatedKeywords": {
      "text1": "Keywords specified above are duplicated in",
      "link": "the other element",
      "text2": "Consider changing them to improve SEO."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import {
  SeoMetadata,
  SeoMetadataDto,
  TwitterCardType,
  CdnMedia,
  SeoCheckModelType,
} from '@heseya/store-core'

import ModalForm from '@/components/form/ModalForm.vue'
import MediaUploadInput from '@/components/modules/media/MediaUploadInput.vue'
import { UUID } from '@/interfaces/UUID'

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
    current: {
      type: Object,
      default: null,
    } as Vue.PropOptions<{ id: UUID; model: SeoCheckModelType }>,
  },

  data: () => ({
    duplicatedKeywordsItem: null as null | {
      // eslint-disable-next-line camelcase
      model_type: SeoCheckModelType
      id: UUID
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
        } else {
          this.duplicatedKeywordsItem = null
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
      const { duplicates } = await this.$accessor.globalSeo.checkDuplicates({
        keywords,
        excluded: this.current,
      })
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
      color: var(--blue-color-400);
      font-size: 1.1em;
      transform: translateY(1px);
    }
  }

  &__switch-tooltip-icon {
    color: var(--blue-color-400);
  }
}
</style>

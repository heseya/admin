<template>
  <modal-form class="seo-form">
    <ContentLangSwitch :value="editedLang" class="seo-form__lang-switch" @input="setEditedLang" />

    <validated-input v-model="formTitle" :disabled="disabled" :label="$t('form.title')" />
    <small class="seo-form__subtext">
      {{ $t('charsCount') }}: {{ formTitle ? formTitle.length : 0 }}
      <info-tooltip>
        {{ $t('titleCharsRecomendation') }}
      </info-tooltip>
    </small>

    <validated-input
      v-model="formDescription"
      :disabled="disabled"
      :label="$t('form.description')"
    />

    <small class="seo-form__subtext">
      {{ $t('charsCount') }}: {{ formDescription ? formDescription.length : 0 }}
      <info-tooltip>
        {{ $t('descriptionCharsRecomendation') }}
      </info-tooltip>
    </small>

    <switch-input v-if="!forceIndex" v-model="formNoIndex" :disabled="disabled" type="red">
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
      :value="formKeywords"
      :label="$t('form.keywords')"
      :disabled="disabled"
      mode="tags"
      @input="setKeywords"
    />

    <a-alert v-if="duplicatedKeywordsItem" type="warning" show-icon style="margin-bottom: 1rem">
      <template #message>
        {{ $t('duplicatedKeywords.text1') }}
        <a :href="duplicatedKeywordUrl || undefined" target="_blank">
          {{ $t('duplicatedKeywords.link') }} </a
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

    <br />
    <PublishedLangsForm v-model="form.published" />

    <TagsEditor v-model="form.header_tags" :disabled="disabled" />

    <media-upload-input
      :label="$t('form.og_image').toString()"
      :disabled="disabled"
      :media="form.og_image"
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
import { defineComponent, PropType } from 'vue'
import {
  SeoMetadata,
  SeoMetadataDto,
  TwitterCardType,
  CdnMedia,
  SeoCheckModelType,
  TranslationsCreateDto,
} from '@heseya/store-core'
import { isEqual } from 'lodash'

import ModalForm from '@/components/form/ModalForm.vue'
import MediaUploadInput from '@/components/modules/media/MediaUploadInput.vue'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'
import ContentLangSwitch from '@/components/lang/ContentLangSwitch.vue'
import TagsEditor from './TagsEditor.vue'

import { UUID } from '@/interfaces/UUID'

import { TranslationsFromDto } from '@/interfaces/Translations'

type SeoMeta = Omit<SeoMetadata & SeoMetadataDto, 'translations'> &
  TranslationsCreateDto<TranslationsFromDto<SeoMetadataDto>>

export const CLEAR_SEO_FORM: SeoMeta = {
  title: '',
  description: '',
  keywords: [],
  header_tags: [],
  twitter_card: TwitterCardType.Summary,
  og_image: undefined,
  og_image_id: undefined,
  no_index: false,
  published: [],
  translations: {},
}

export default defineComponent({
  components: {
    ModalForm,
    TagsEditor,
    MediaUploadInput,
    PublishedLangsForm,
    ContentLangSwitch,
  },
  props: {
    value: {
      type: Object as PropType<SeoMeta | undefined>,
      default: () => undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    forceIndex: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Object as PropType<{ id: UUID; model: SeoCheckModelType }>,
      default: null,
    },
  },

  data: () => ({
    editedLang: '',
    duplicatedKeywordsItem: null as null | {
      // eslint-disable-next-line camelcase
      model_type: SeoCheckModelType
      id: UUID
    },
  }),

  computed: {
    form: {
      get(): SeoMeta {
        return this.value || { translations: {}, published: [] }
      },
      set(v: SeoMeta) {
        this.$emit('input', v)
      },
    },

    formTitle: {
      get(): string {
        return this.form.translations?.[this.editedLang]?.title || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].title = value
      },
    },
    formDescription: {
      get(): string {
        return this.form.translations?.[this.editedLang]?.description || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].description = value
      },
    },
    formKeywords: {
      get(): string[] {
        return this.form.translations?.[this.editedLang]?.keywords || []
      },
      set(value: string[]) {
        this.form.translations[this.editedLang].keywords = value
      },
    },
    formNoIndex: {
      get(): boolean {
        return this.form.translations?.[this.editedLang]?.no_index ?? false
      },
      set(value: boolean) {
        this.form.translations[this.editedLang].no_index = value
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
    formKeywords: {
      handler(keywords: string[]) {
        if (keywords?.length) {
          this.checkDuplicates(keywords)
        } else {
          this.duplicatedKeywordsItem = null
        }
      },
      deep: true,
    },

    value: {
      handler() {
        const initialForm = {
          title: this.form.title || CLEAR_SEO_FORM.title,
          description: this.form.description || CLEAR_SEO_FORM.description,
          header_tags: this.form.header_tags || CLEAR_SEO_FORM.header_tags,
          keywords: this.form.keywords || CLEAR_SEO_FORM.keywords,
          og_image: this.form.og_image || CLEAR_SEO_FORM.og_image,
          og_image_id: this.form.og_image?.id || CLEAR_SEO_FORM.og_image_id,
          twitter_card: this.form.twitter_card || CLEAR_SEO_FORM.twitter_card,
          no_index: this.form.no_index || CLEAR_SEO_FORM.no_index,
          translations: this.form.translations || {},
          published: this.form.published || [],
        }

        if (!isEqual(this.form, initialForm)) this.form = initialForm

        this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
      },
      immediate: true,
    },
  },

  created() {
    const initialForm = {
      title: this.form.title || CLEAR_SEO_FORM.title,
      description: this.form.description || CLEAR_SEO_FORM.description,
      header_tags: this.form.header_tags || CLEAR_SEO_FORM.header_tags,
      keywords: this.form.keywords || CLEAR_SEO_FORM.keywords,
      og_image: this.form.og_image || CLEAR_SEO_FORM.og_image,
      og_image_id: this.form.og_image?.id || CLEAR_SEO_FORM.og_image_id,
      twitter_card: this.form.twitter_card || CLEAR_SEO_FORM.twitter_card,
      no_index: this.form.no_index || CLEAR_SEO_FORM.no_index,
      translations: this.form.translations || {},
      published: this.form.published || [],
    }
    if (!isEqual(this.form, initialForm)) this.form = initialForm
  },

  methods: {
    setEditedLang(langId: string) {
      this.editedLang = langId

      if (!this.form.translations) this.$set(this.form, 'translations', {})

      if (!this.form.translations?.[langId])
        this.$set(this.form.translations!, langId, {
          title: '',
          description: '',
          keywords: [],
          no_index: false,
        })
      else {
        this.$set(this.form.translations![langId], 'title', this.formTitle)
        this.$set(this.form.translations![langId], 'description', this.formDescription)
        this.$set(this.form.translations![langId], 'keywords', this.formKeywords)
        this.$set(this.form.translations![langId], 'no_index', this.formNoIndex)
      }
    },

    changeMedia(media: CdnMedia | undefined) {
      this.form.og_image = media
      this.form.og_image_id = media?.id || null
    },

    setKeywords(keywords: string[]) {
      this.formKeywords = keywords
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
  &__lang-switch {
    margin-bottom: 8px;
    margin-left: auto;
    background-color: transparent;
  }

  &__subtext {
    display: block;
    text-align: right;
    margin-top: -6px;
    margin-bottom: 4px;
    font-size: 0.6rem;
    color: var(--gray-color-500);

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

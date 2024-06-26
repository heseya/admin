<template>
  <validation-observer v-slot="{ handleSubmit }" class="attribute-form">
    <validated-input
      v-model="formName"
      :disabled="disabled"
      name="name"
      rules="required"
      :label="$t('common.form.name').toString()"
      @input="editSlug"
    />
    <validated-input
      v-model="form.slug"
      :disabled="disabled"
      name="slug"
      rules="required|slug"
      :label="$t('form.slug').toString()"
    />
    <validated-input
      v-model="formDescription"
      :disabled="disabled"
      name="description"
      rules="required"
      :label="$t('common.form.description').toString()"
    />

    <div class="attribute-form__switches">
      <switch-input v-model="form.include_in_text_search" :disabled="disabled" horizontal>
        <template #title>
          {{ $t('form.includeInSearch') }}
          <info-tooltip> {{ $t('form.includeInSearchTooltip') }}</info-tooltip>
        </template>
      </switch-input>

      <switch-input
        v-if="form.include_in_text_search"
        v-model="form.match_any"
        :disabled="disabled"
        horizontal
      >
        <template #title>
          {{ $t('form.matchAny') }}
          <info-tooltip> {{ $t('form.matchAnyTooltip') }}</info-tooltip>
        </template>
      </switch-input>

      <switch-input v-model="form.global" :disabled="disabled" horizontal>
        <template #title>
          {{ $t('form.global') }}
          <info-tooltip> {{ $t('form.globalTooltip') }}</info-tooltip>
        </template>
      </switch-input>

      <switch-input v-model="form.sortable" :disabled="disabled" horizontal>
        <template #title>
          {{ $t('form.sortable') }}
          <info-tooltip> {{ $t('form.sortableTooltip') }}</info-tooltip>
        </template>
      </switch-input>
    </div>

    <br />
    <PublishedLangsForm v-model="form.published" />
    <br />

    <app-select
      v-model="form.type"
      :label="$t('common.form.type').toString()"
      :disabled="disabled || !isNew"
    >
      <a-select-option
        v-for="t in AttributeType"
        :key="t"
        :value="t"
        :label="$t(`attributeTypes.${t}`)"
      >
        {{ $t(`attributeTypes.${t}`) }}
      </a-select-option>
    </app-select>

    <template v-if="!isNew">
      <hr />
      <MetadataForm
        ref="publicMeta"
        :value="attribute.metadata"
        :disabled="disabled"
        model="attributes"
      />
      <MetadataForm
        v-if="attribute.metadata_private"
        ref="privateMeta"
        :value="attribute.metadata_private"
        :disabled="disabled"
        type="private"
        model="attributes"
      />
    </template>

    <br />
    <app-button data-cy="submit-btn" :disabled="disabled" @click.stop="handleSubmit(submit)">
      {{ $t('common.save') }}
    </app-button>

    <template v-if="!isNew && optionsVisible">
      <hr />
      <OptionsList :attribute-id="attribute.id" :disabled="disabled" :type="form.type" />
    </template>

    <AbsoluteContentLangSwitch
      class="attribute-form__lang-switch"
      :value="editedLang"
      @input="setEditedLang"
    />
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "slug": "Skrócona nazwa",
      "includeInSearch": "Uwzględnij w wyszukiwarce",
      "includeInSearchTooltip": "Uwzględnij atrybut w wyszukiwarce produktów. Dzięki temu łatwo znajdziej produkty dla których atrybut ma daną wartość.",
      "matchAny": "Dopasuj dowolne",
      "matchAnyTooltip": "Dopasuj dowolne oznacza, że jeśli w polu wyszukiwania zostanie podana wiele wartości atrybutów, to znalezione zostaną produkty które posiadają przynajmniej atrybut o przynajmniej jednej z podanych wartości.",
      "global": "Globalna atrybut",
      "globalTooltip": "Globalna atrybut oznacza, że po danej cesze można filtrować produkty niezależnie od kolekcji w której się one znajdują.",
      "sortable": "Sortowalny atrybut",
      "sortableTooltip": "Sortowalny atrybut oznacza, że po danej cesze można sortować listę produktów."
    },
    "alerts": {
      "created": "Atrybut został utworzony.",
      "updated": "Atrybut został zaktualizowany."
    }
  },
  "en": {
    "form": {
      "slug": "Short name",
      "includeInSearch": "Include in search",
      "includeInSearchTooltip": "Include attribute in product search. This allows you to easily find products for which the attribute has a given value.",
      "matchAny": "Match any",
      "matchAnyTooltip": "Match any means that if multiple attribute values are entered in the search field, products that have at least one attribute with at least one of the entered values will be found.",
      "global": "Global attribute",
      "globalTooltip": "Global attribute means that you can filter products independently from the collection in which they are located.",
      "sortable": "Sortable attribute",
      "sortableTooltip": "Sortable attribute means that you can sort products by this attribute."
    },
    "alerts": {
      "created": "Attribute has been created.",
      "updated": "Attribute has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import { Attribute, AttributeCreateDto, AttributeType } from '@heseya/store-core'

import { generateSlug } from '@/utils/generateSlug'
import { UUID } from '@/interfaces/UUID'
import { TranslationsFromDto } from '@/interfaces/Translations'

import OptionsList from './OptionsList.vue'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'
import AbsoluteContentLangSwitch from '@/components/lang/AbsoluteContentLangSwitch.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

const CLEAR_TRANSLATION_FORM: TranslationsFromDto<AttributeCreateDto> = {
  name: '',
  description: '',
}

const CLEAR_FORM: AttributeCreateDto = {
  slug: '',
  description: '',
  type: AttributeType.SingleOption,
  sortable: false,
  global: false,
  include_in_text_search: false,
  match_any: false,
  translations: {},
  published: [],
  metadata: {},
  metadata_private: {},
}

export default defineComponent({
  components: {
    MetadataForm,
    ValidationObserver,
    OptionsList,
    PublishedLangsForm,
    AbsoluteContentLangSwitch,
  },
  props: {
    attribute: {
      type: Object as PropType<Attribute>,
      default: undefined,
    },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    editedLang: '',
    form: {} as AttributeCreateDto & { id?: UUID },
    AttributeType: AttributeType,
  }),
  computed: {
    isNew(): boolean {
      return !this.form.id
    },

    optionsVisible(): boolean {
      return [AttributeType.MultiChoiceOption, AttributeType.SingleOption].includes(this.form.type)
    },

    formName: {
      get(): string {
        return this.form.translations[this.editedLang]?.name || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].name = value
      },
    },
    formDescription: {
      get(): string {
        return this.form.translations[this.editedLang]?.description || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].description = value
      },
    },
  },
  watch: {
    attribute: {
      handler(v) {
        this.form = cloneDeep({ ...CLEAR_FORM, ...v })
        this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
      },
      immediate: true,
    },
  },
  methods: {
    setEditedLang(langId: string) {
      this.editedLang = langId

      this.$set(this.form.translations, langId, {
        ...CLEAR_TRANSLATION_FORM,
        ...this.form.translations[langId],
      })
    },

    editSlug() {
      if (this.isNew) this.form.slug = generateSlug(this.formName)
    },
    async submit() {
      this.$accessor.startLoading()
      try {
        if (!this.form?.id) {
          const newAttribute = await this.$accessor.attributes.add(this.form)
          if (!newAttribute || !newAttribute.id) throw new Error('Attribute not created')

          this.$toast.success(this.$t('alerts.created') as string)
          this.$emit('submit', newAttribute)
        } else {
          await this.saveMetadata(this.form.id)

          const editedAttribute = await this.$accessor.attributes.update({
            id: this.form.id,
            item: this.form,
          })
          if (!editedAttribute) throw new Error('Attribute not updated')

          this.$toast.success(this.$t('alerts.updated') as string)
          this.$emit('submit', editedAttribute)
        }
      } catch {
      } finally {
        this.$accessor.stopLoading()
      }
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },
  },
})
</script>

<style lang="scss">
.attribute-form {
  display: block;
  position: relative;

  &__lang-switch {
    left: calc(100% + 16px);
  }

  &__switches {
    display: flex;
    justify-content: space-evenly;
    gap: 8px;
  }
}
</style>

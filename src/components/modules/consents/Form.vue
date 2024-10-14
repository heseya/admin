<template>
  <validation-observer v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <card>
        <validated-input
          v-model="formName"
          rules="required"
          :label="$t('common.form.name').toString()"
          :disabled="disabled"
        />
        <div class="row">
          <app-select
            v-model="form.type"
            :label="$t('common.form.type').toString()"
            :disabled="!isNew"
          >
            <a-select-option
              :value="ConsentType.Organization"
              :label="$t(`consentType.${ConsentType.Organization}`).toString()"
            >
              {{ $t(`consentType.${ConsentType.Organization}`) }}
            </a-select-option>
            <a-select-option
              :value="ConsentType.User"
              :label="$t(`consentType.${ConsentType.User}`).toString()"
            >
              {{ $t(`consentType.${ConsentType.User}`) }}
            </a-select-option>
          </app-select>
          <switch-input
            v-model="form.required"
            :label="$t('common.form.required').toString()"
            horizontal
          />
        </div>

        <br />
        <PublishedLangsForm v-model="form.published" />

        <label class="app-input__label" :name="$t('common.form.description').toString()">
          {{ $t('common.form.description') }}
        </label>
        <rich-editor v-model="formDescriptionHtml" :disabled="disabled" />
        <br />
        <app-button v-if="!disabled" html-type="submit">
          {{ $t('common.save') }}
        </app-button>
      </card>
    </form>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "consentType": {
      "user": "Zgoda użytkownika",
      "organization": "Zgoda organizacji"
    }
  },
  "en": {
    "consentType": {
      "user": "User consent",
      "organization": "Organization consent"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { ConsentCreateDto, ConsentType } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import RichEditor from '@/components/form/RichEditor.vue'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'

export default defineComponent({
  components: {
    ValidationObserver,
    Card,
    RichEditor,
    PublishedLangsForm,
  },
  props: {
    isNew: {
      type: Boolean,
      required: true,
    },
    editedLang: {
      type: String,
      required: true,
    },
    value: {
      type: Object as PropType<ConsentCreateDto>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ConsentType(): typeof ConsentType {
      return ConsentType
    },
    form: {
      get(): ConsentCreateDto {
        return this.value
      },
      set(v: ConsentCreateDto) {
        this.$emit('input', v)
      },
    },

    formDescriptionHtml: {
      get(): string {
        return this.form.translations[this.editedLang]?.description_html || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].description_html = value
      },
    },
    formName: {
      get(): string {
        return this.form.translations[this.editedLang]?.name || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].name = value
      },
    },
  },
  methods: {
    submit() {
      this.$emit('submit', this.form)
    },
  },
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
</style>

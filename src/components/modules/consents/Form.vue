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

        <br />
        <PublishedLangsForm v-model="form.published" />

        <label class="app-input__label" :name="$t('common.form.description').toString()">
          {{ $t('common.form.description') }}
        </label>
        <rich-editor v-model="formDescriptionHtml" :disabled="disabled" />
        <br />
        <div class="switches">
          <switch-input
            v-model="form.required"
            :label="$t('common.form.required').toString()"
            horizontal
          />
        </div>
        <br />
        <app-button v-if="!disabled" html-type="submit">
          {{ $t('common.save') }}
        </app-button>
      </card>
    </form>
  </validation-observer>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { ConsentCreateDto } from '@heseya/store-core'

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
.switches {
  display: flex;
}
</style>

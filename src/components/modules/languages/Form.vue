<template>
  <modal-form>
    <validated-input
      v-model="form.name"
      :disabled="disabled"
      rules="required"
      :label="$t('common.form.name')"
    />

    <validated-input
      v-model="form.iso"
      :disabled="disabled"
      rules="required"
      :label="$t('form.iso')"
    />

    <div class="switches-row">
      <switch-input v-model="form.hidden" :disabled="disabled || form.default" horizontal>
        <template #title>
          {{ $t('form.hidden') }}
          <info-tooltip v-if="form.default">
            {{ $t('hiddenWhenDefaultTooltip') }}
          </info-tooltip>
        </template>
      </switch-input>

      <switch-input v-model="form.default" :disabled="disabled" horizontal>
        <template #title>
          {{ $t('form.default') }}
          <info-tooltip>
            {{ $t('changeDefaultTooltip') }}
          </info-tooltip>
        </template>
      </switch-input>
    </div>
  </modal-form>
</template>

<i18n>
{
  "pl": {
    "form": {
      "iso": "Kod ISO",
      "default": "Język domyślny",
      "hidden": "Ukryty"
    },
    "changeDefaultTooltip": "Tylko jeden język jest domyślny. W przypadku gdy użytkownik nie wybierze języka samodzielnie, treść zostanie wyświetlona w języku domyślnym.",
    "hiddenWhenDefaultTooltip": "Język domyślny nie może być ukryty."
  },
  "en": {
    "form": {
      "iso": "ISO code",
      "default": "Default language",
      "hidden": "Hidden"
    },
    "changeDefaultTooltip": "Only one language is default. In case the user does not choose a language manually, the content will be displayed in the default language.",
    "hiddenWhenDefaultTooltip": "The default language cannot be hidden."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import ModalForm from '@/components/form/ModalForm.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'
import { LanguageDto } from '@/interfaces/Language'

export default Vue.extend({
  components: {
    ModalForm,
    ValidatedInput,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<LanguageDto>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): LanguageDto {
        return this.value
      },
      set(discount: LanguageDto) {
        this.$emit('input', discount)
      },
    },
  },
  watch: {
    'form.default'(v) {
      if (v) this.form.hidden = false
    },
  },
})
</script>

<style lang="scss" scoped>
.switches-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

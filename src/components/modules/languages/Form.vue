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

    <switch-input
      v-model="form.hidden"
      :disabled="disabled"
      horizontal
      :label="$t('form.hidden')"
    />

    <switch-input v-model="form.default" :disabled="disabled" horizontal>
      <template #title>
        {{ $t('form.default') }}
        <!-- <a-tooltip>
          <template #title> {{ $t('changeDefaultTooltip') }} </template>
          <i class="bx bxs-info-circle"></i>
        </a-tooltip> -->
      </template>
    </switch-input>
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
    "changeDefaultTooltip": "TODO"
  },
  "en": {
    "form": {
      "iso": "ISO code",
      "default": "Default language",
      "hidden": "Hidden"
    },
    "changeDefaultTooltip": "TODO"
  }
}
</i18n>

<script lang="ts">
// TODO: tooltip przy języku domyślnym z konsekwencjami zmiani
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
})
</script>

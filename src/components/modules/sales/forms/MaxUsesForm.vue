<template>
  <div class="max-uses-form">
    <validated-input
      v-model="form.max_uses"
      :name="`${formId}.max_uses`"
      type="number"
      rules="not-negative"
      :disabled="disabled"
      :label="$t('form.max_uses')"
    />
  </div>
</template>

<i18n>
{
  "en": {
    "form": {
      "max_uses": "Max uses"
    }
  },
  "pl": {
    "form": {
      "max_uses": "Maksymalna ilość użyć"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

interface MaxUsesForm {
  // eslint-disable-next-line camelcase
  max_uses: number
}

export default Vue.extend({
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<MaxUsesForm>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    formId(): string {
      // ? Unofficial Vue api
      // @ts-ignore
      return this._uid
    },
    form: {
      get(): MaxUsesForm {
        return this.value
      },
      set(v: MaxUsesForm) {
        this.$emit('input', v)
      },
    },
  },
})
</script>

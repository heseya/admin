<template>
  <div class="max-uses-form">
    <validated-input
      v-model="form.max_uses"
      :name="`${formId}.max_uses`"
      type="number"
      rules="positive"
      :disabled="disabled"
      :label="$t('form.max_uses').toString()"
    />
  </div>
</template>

<i18n lang="json">
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
import { defineComponent, PropType } from 'vue'

interface MaxUsesForm {
  // eslint-disable-next-line camelcase
  max_uses: number
}

export default defineComponent({
  props: {
    value: { type: Object as PropType<MaxUsesForm>, required: true },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    formId(): string {
      // @ts-ignore // ? Unofficial Vue api
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

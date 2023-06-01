<template>
  <a-modal
    :visible="!!editedOption"
    :title="editedOption && editedOption.id ? $t('edit') : $t('add')"
    :footer="null"
    @cancel="editedOption = null"
  >
    <template v-if="editedOption">
      <validated-input
        v-if="type !== AttributeType.Date"
        v-model="editedOption.name"
        :disabled="disabled"
        name="name"
        rules="required"
        :label="
          type === AttributeType.SingleOption ? $t('form.value_text') : $t('common.form.name')
        "
      />

      <validated-input
        v-if="type === AttributeType.Number"
        v-model="editedOption.value_number"
        disabled
        type="number"
        name="value_number"
        :label="$t('form.value_number').toString()"
      />

      <validated-input
        v-if="type === AttributeType.Date"
        v-model="editedOption.value_date"
        disabled
        type="date"
        name="value_date"
        :label="$t('form.value_date').toString()"
      />

      <app-button @click="saveModalForm">
        {{ $t('common.save') }}
      </app-button>
    </template>
  </a-modal>
</template>

<i18n lang="json">
{
  "pl": {
    "add": "Dodaj opcję",
    "edit": "Edytuj opcję",
    "formSuccess": "Opcja została zapisana",
    "form": {
      "value_text": "Wartość tekstowa",
      "value_number": "Wartość liczbowa",
      "value_date": "Data"
    }
  },
  "en": {
    "add": "Add option",
    "edit": "Edit option",
    "formSuccess": "Option has been saved",
    "form": {
      "value_text": "Text value",
      "value_number": "Number value",
      "value_date": "Date value"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { AttributeType, AttributeOptionDto } from '@heseya/store-core'

import { formatApiNotificationError } from '@/utils/errors'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<AttributeOptionDto | null>,
      default: null,
    },
    attributeId: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<AttributeType>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    editedOption: {
      get(): AttributeOptionDto | null {
        return this.value
      },
      set(value: AttributeOptionDto) {
        this.$emit('input', value)
      },
    },
    AttributeType(): typeof AttributeType {
      return AttributeType
    },
    areOptionsEditable(): boolean {
      return (
        this.type === AttributeType.SingleOption || this.type === AttributeType.MultiChoiceOption
      )
    },
  },

  methods: {
    async saveModalForm() {
      if (!this.editedOption) return
      this.$accessor.startLoading()

      try {
        if (this.editedOption.id) {
          const result = await this.$accessor.attributes.updateOption({
            attributeId: this.attributeId,
            optionId: this.editedOption.id,
            option: this.editedOption,
          })
          if (!result.success) throw result.error
        } else {
          const result = await this.$accessor.attributes.addOption({
            attributeId: this.attributeId,
            option: this.editedOption,
          })
          if (!result.success) throw result.error
        }
        this.$toast.success(this.$t('formSuccess') as string)
        this.editedOption = null
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

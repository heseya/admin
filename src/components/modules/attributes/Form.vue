<template>
  <validation-observer v-slot="{ handleSubmit }" class="attribute-form">
    <validated-input
      v-model="form.name"
      :disabled="disabled"
      name="name"
      rules="required"
      :label="$t('common.form.name')"
    />
    <validated-input
      v-model="form.description"
      :disabled="disabled"
      name="description"
      :label="$t('common.form.description')"
    />

    <switch-input v-model="form.global" :disabled="disabled" horizontal>
      <template #title>
        {{ $t('form.global') }}

        <a-tooltip>
          <template #title> {{ $t('form.globalTooltip') }} </template>
          <i class="bx bxs-info-circle"></i>
        </a-tooltip>
      </template>
    </switch-input>

    <app-select v-model="form.type" :label="$t('common.form.type')">
      <a-select-option :value="AttributeType.Text" :label="$t('types.' + AttributeType.Text)">
        {{ $t('types.' + AttributeType.Text) }}
      </a-select-option>
    </app-select>

    <br />

    <app-button data-cy="submit-btn" :disabled="disabled" @click.stop="handleSubmit(submit)">
      {{ $t('common.save') }}
    </app-button>
  </validation-observer>
</template>

<i18n>
{
  "pl": {
    "types": {
      "text": "Tekstowy jednokrotnego wyboru",
      "number": "Liczbowy jednokrotnego wyboru"
    },
    "form": {
      "global": "Globalny atrybut",
      "globalTooltip": "Globalny atrybut oznacza, że po danym atrybucie można filtrować produkty niezależnie od kolekcji w której się one znajdują."
    },
    "alerts": {
      "created": "Cecha została utworzona.",
      "updated": "Cecha została zaktualizowana."
    }
  },
  "en": {
    "types": {
      "text": "Text single choice",
      "number": "Number single choice"
    },
    "form": {
      "global": "Global attribute",
      "globalTooltip": "Global attribute means that you can filter products independently from the collection in which they are located."
    },
    "alerts": {
      "created": "Attribute has been created.",
      "updated": "Attribute has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'

import { Attribute, AttributeDto, AttributeType } from '@/interfaces/Attribute'
import { UUID } from '@/interfaces/UUID'

const CLEAR_FORM: AttributeDto = {
  name: '',
  description: '',
  type: AttributeType.Text,
  global: false,
  options: [],
}

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  props: {
    attribute: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Attribute>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    form: cloneDeep(CLEAR_FORM) as AttributeDto & { id?: UUID },
    AttributeType: AttributeType,
  }),
  methods: {
    async submit() {
      this.$accessor.startLoading()
      try {
        if (!this.form?.id) {
          const newAttribute = await this.$accessor.attributes.add(this.form)
          if (!newAttribute || !newAttribute.id) throw new Error('Attribute not created')

          this.$toast.success(this.$t('alerts.created') as string)
          this.$emit('submit', newAttribute)
        } else {
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
  },
})
</script>

<style lang="scss"></style>

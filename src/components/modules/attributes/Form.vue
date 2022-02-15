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

    TODO: rest of the fields

    <br />

    <app-button data-cy="submit-btn" :disabled="disabled" @click.stop="handleSubmit(submit)">
      {{ $t('common.save') }}
    </app-button>
  </validation-observer>
</template>

<i18n>
{
  "pl": {
    "alerts": {
      "created": "Cecha została utworzona.",
      "updated": "Cecha została zaktualizowana."
    }
  },
  "en": {
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
        let id = ''

        if (!this.form?.id) {
          const schema = await this.$accessor.attributes.add(this.form)
          if (!schema) throw new Error('Schema not created')

          if (schema && schema.id) {
            this.$toast.success(this.$t('alerts.created') as string)
            id = schema.id
          }
        } else {
          const success = await this.$accessor.attributes.update({
            id: this.form.id,
            item: this.form,
          })
          if (!success) throw new Error('Schema not updated')

          id = this.form.id
          this.$toast.success(this.$t('alerts.updated') as string)
        }
        this.$emit('submit', this.$accessor.schemas.getFromListById(id))
      } catch {
      } finally {
        this.$accessor.stopLoading()
      }
    },
  },
})
</script>

<style lang="scss"></style>

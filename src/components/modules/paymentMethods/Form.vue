<template>
  <validation-observer v-slot="{ handleSubmit }">
    <a-modal :visible="active" width="550px" :title="$t('title')" @cancel="close">
      <modal-form v-if="editedItem" class="payment-methods-form">
        <validated-input
          v-model="editedItem.name"
          rules="required"
          :label="$t('common.form.name')"
        />
        <validated-input v-model="editedItem.icon" rules="required" :label="$t('form.icon')" />
        <br />
        <switch-input v-model="editedItem.public" :label="$t('form.public')" horizontal />
      </modal-form>
      <template #footer>
        <div class="row">
          <app-button @click="handleSubmit(updateMethod)">
            {{ $t('common.save') }}
          </app-button>
        </div>
      </template>
    </a-modal>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Szczegóły metody płatności",
    "form": {
      "icon": "Ikona",
      "public": "Publiczna"
    }
  },
  "en": {
    "title": "Payment method details",
    "form": {
      "icon": "Icon",
      "public": "Public"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { PaymentMethod, PaymentMethodUpdateDto } from '@heseya/store-core'
import { ValidationObserver } from 'vee-validate'

import ModalForm from '@/components/form/ModalForm.vue'

import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: {
    ValidationObserver,
    ModalForm,
  },

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Object,
      default: null,
    } as Vue.PropOptions<PaymentMethod>,
  },

  data: () => ({
    editedItem: null as PaymentMethodUpdateDto | null,
  }),

  watch: {
    selected: {
      immediate: true,
      handler() {
        this.editedItem = this.selected
          ? {
              ...this.selected,
            }
          : null
      },
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async updateMethod() {
      this.$accessor.startLoading()

      try {
        if (!this.editedItem) {
          // TODO: message
          throw new Error('No edited item')
        }

        await this.$accessor.paymentMethods.update({
          id: this.selected.id,
          item: this.editedItem,
        })

        // TODO: message
        this.$toast.success(this.$t('success') as string)
      } catch (error: any) {
        this.$toast.error(formatApiNotificationError(error))
      }

      this.$accessor.stopLoading()
      this.close()
    },
  },
})
</script>

<style lang="scss" scoped>
.payment-methods-form {
  display: flex;
}
</style>

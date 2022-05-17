<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="paymentMethods" draggable>
      <template #nav>
        <icon-button v-can="$p.PaymentMethods.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
      <template #default="{ item: paymentMethod }">
        <list-item :key="paymentMethod.id" @click="openModal(paymentMethod.id)">
          {{ paymentMethod.name }}
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? $t('editTitle') : $t('newTitle')"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.name"
            :disabled="!canModify"
            rules="required"
            :label="$t('common.form.name')"
          />

          <validated-input
            v-model="editedItem.icon"
            :disabled="!canModify"
            rules="required"
            :label="$t('form.icon')"
          />

          <validated-input
            v-model="editedItem.url"
            :disabled="!canModify"
            rules="required"
            :label="$t('form.url')"
          />
          <br />

          <SwitchInput
            v-model="editedItem.public"
            :disabled="!canModify"
            horizontal
            :label="$t('form.public')"
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.PaymentMethods.Remove"
              :title="$t('deleteText')"
              :ok-text="$t('common.delete')"
              :cancel-text="$t('common.cancel')"
              @confirm="deleteItem"
            >
              <app-button v-if="editedItem.id" type="danger">{{ $t('common.delete') }}</app-button>
            </pop-confirm>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Metody płatności",
    "add": "Dodaj metodę płatności",
    "editTitle": "Edycja metody",
    "newTitle": "Nowa metoda płatności",
    "deleteText": "Czy na pewno chcesz usunąć tę metodę płatności?",
    "form": {
      "icon":"Ikona",
      "url":"Url",
      "public":"Publiczna"
    },
    "alerts": {
      "deleted": "Metoda płatności została usunięta.",
      "created": "Metoda płatności została dodana.",
      "updated": "Metoda płatności została zaktualizowana."
    }
  },
  "en": {
    "title": "Payment methods",
    "add": "Add payment method",
    "editTitle": "Edit payment method",
    "newTitle": "New payment method",
    "deleteText": "Are you sure you want to delete this payment method?",
    "form": {
      "icon":"Icon",
      "url":"Url",
      "public":"Public"
    },
    "alerts": {
      "deleted": "Payment method has been deleted.",
      "created": "Payment method been added.",
      "updated": "Payment method has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'

import { UUID } from '@/interfaces/UUID'
import { PaymentMethod, PaymentMethodDto } from '@/interfaces/PaymentMethod'

const CLEAR_PAYMENT_METHOD: PaymentMethodDto = {
  name: '',
  icon: '',
  public: false,
  url: '',
}

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    SwitchInput,
  },
  data: () => ({
    isModalActive: false,
    editedItem: clone(CLEAR_PAYMENT_METHOD) as PaymentMethodDto & { id?: string },
    selectedItem: null as PaymentMethod | null,
  }),
  computed: {
    canModify(): boolean {
      return this.$can(
        this.editedItem.id ? this.$p.PaymentMethods.Edit : this.$p.PaymentMethods.Add,
      )
    },
  },
  methods: {
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        this.editedItem = clone(this.$accessor.paymentMethods.getFromListById(id))
        this.selectedItem = this.$accessor.paymentMethods.getFromListById(id)
      } else {
        this.editedItem = clone(CLEAR_PAYMENT_METHOD)
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        const success = await this.$accessor.paymentMethods.update({
          id: this.editedItem.id,
          item: this.editedItem,
        })
        if (success) this.$toast.success(this.$t('alerts.updated') as string)
      } else {
        const success = await this.$accessor.paymentMethods.add(this.editedItem)
        if (success) this.$toast.success(this.$t('alerts.created') as string)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      const success = await this.$accessor.paymentMethods.remove(this.editedItem.id!)

      if (success) this.$toast.success(this.$t('alerts.deleted') as string)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
})
</script>

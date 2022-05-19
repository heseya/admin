<template>
  <div class="warehouse-item-modal">
    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        :visible="visible"
        width="550px"
        :title="form.id ? $t('editTitle') : $t('newTitle')"
        @cancel="close"
      >
        <modal-form>
          <validated-input
            v-model="form.name"
            :disabled="disabled"
            rules="required"
            :label="$t('common.form.name')"
          />

          <validated-input
            v-model="form.sku"
            :disabled="disabled"
            rules="required"
            :label="$t('form.sku')"
          />

          <div class="warehouse-item-modal__row">
            <validated-input
              v-model="form.unlimited_stock_shipping_date"
              :disabled="disabled"
              type="date"
              rules="required"
            >
              <template #label>
                {{ $t('form.unlimited_stock_shipping_date') }}
                <info-tooltip>
                  {{ $t('form.unlimited_stock_shipping_date_tooltip') }}
                </info-tooltip>
              </template>
            </validated-input>

            <validated-input
              v-model="form.unlimited_stock_shipping_time"
              :disabled="disabled"
              type="number"
              rules="required|not-negative"
            >
              <template #label>
                {{ $t('form.unlimited_stock_shipping_time') }}
                <info-tooltip>
                  {{ $t('form.unlimited_stock_shipping_time_tooltip') }}
                </info-tooltip>
              </template>
            </validated-input>
          </div>

          <field v-if="item" :label="$t('form.quantity')">{{ item.quantity }}</field>

          <template v-if="item">
            <hr />
            <items-availibility :item="item" />
          </template>

          <template v-if="item">
            <hr />
            <MetadataForm
              ref="publicMeta"
              :value="item.metadata"
              :disabled="disabled"
              model="items"
            />
            <MetadataForm
              v-if="item.metadata_private"
              ref="privateMeta"
              :value="item.metadata_private"
              :disabled="disabled"
              is-private
              model="items"
            />
          </template>
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="!disabled" @click="handleSubmit(saveWarehouseItem)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Items.Remove"
              :title="$t('deleteText')"
              :ok-text="$t('common.delete')"
              :cancel-text="$t('common.cancel')"
              @confirm="deleteWarehouseItem"
            >
              <app-button v-if="form.id" type="danger">{{ $t('common.delete') }}</app-button>
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
    "editTitle": "Edycja przedmiotu",
    "newTitle": "Nowy przedmiot",
    "deleteText": "Czy na pewno chcesz usunąć ten przedmiot?",
    "form": {
      "sku": "SKU",
      "quantity": "Łączna ilość w magazynie",
      "unlimited_stock_shipping_time": "Czas wysyłki w nielimitowanej ilości",
      "unlimited_stock_shipping_time_tooltip": "Oznacza czas wysyłki w dniach przedmiotów w nielimitowanej ilości. Oznacza to, że produkt będzie można kupić, nawet jeśli nie będzie dostępny na magazynie.",
      "unlimited_stock_shipping_date": "Data wysyłki w nielimitowanej ilości",
      "unlimited_stock_shipping_date_tooltip": "Oznacza, że wysyłka będzie realizowana po danej dacie. Przedmiot ma nielimitowany stan do podanej daty włącznie. Gdy ta data minie, produkt staje się niedostępny."
    },
    "alerts": {
      "deleted": "Przedmiot magazynowy został usunięty.",
      "created": "Przedmiot magazynowy został dodany.",
      "updated": "Przedmiot magazynowy został zaktualizowany."
    }
  },
  "en": {
    "editTitle": "Edit item",
    "newTitle": "New item",
    "deleteText": "Are you sure you want to delete this item?",
    "form": {
      "sku": "SKU",
      "quantity": "Total quantity in stock",
      "unlimited_stock_shipping_time": "Unlimited stock shipping time",
      "unlimited_stock_shipping_time_tooltip": "Indicates the time of shipping in days before the item is unavailable. This means that the item can be purchased even if it is not available in stock.",
      "unlimited_stock_shipping_date": "Unlimited stock shipping date",
      "unlimited_stock_shipping_date_tooltip": "Indicates that the shipping will be carried out on the given date. The item will be unavailable until that date. When that date is reached, the item will be unavailable."
    },
    "alerts": {
      "deleted": "Item in warehouse has been deleted.",
      "created": "Item in warehouse has been added.",
      "updated": "Item in warehouse has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import { WarehouseItem, WarehouseItemCreateDto } from '@/interfaces/WarehouseItem'

import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import Field from '@/components/Field.vue'
import ItemsAvailibility from './ItemsAvailibility.vue'

type Form = WarehouseItemCreateDto & Partial<WarehouseItem>

export default Vue.extend({
  components: { ValidationObserver, ModalForm, PopConfirm, MetadataForm, Field, ItemsAvailibility },
  props: {
    item: { type: Object, default: null } as Vue.PropOptions<WarehouseItem | null>,
    value: { type: Object, required: true } as Vue.PropOptions<Form>,
    visible: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },

  computed: {
    form: {
      get(): Form {
        return this.value
      },
      set(v: Form) {
        this.$emit('input', v)
      },
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async deleteWarehouseItem() {
      this.$accessor.startLoading()
      await this.$accessor.items.remove(this.form.id!)
      this.$toast.success(this.$t('alerts.deleted') as string)
      this.$accessor.stopLoading()
      this.close()
    },

    async saveWarehouseItem() {
      this.$accessor.startLoading()
      const isNew = !this.form.id
      let success = false
      if (this.form.id) {
        // Metadata can be saved only after product is created
        await this.saveMetadata(this.form.id)

        success = !!(await this.$accessor.items.update({
          id: this.form.id,
          item: this.form,
        }))
      } else {
        success = !!(await this.$accessor.items.add(this.form))
      }
      this.$accessor.stopLoading()

      if (success) {
        this.close()

        if (!isNew) this.$toast.success(this.$t('alerts.updated') as string)
        else this.$toast.success(this.$t('alerts.created') as string)
      }
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },
  },
})
</script>

<style lang="scss" scoped>
.warehouse-item-modal {
  &__row {
    display: flex;

    *:not(:last-of-type) {
      margin-right: 8px;
    }
  }
}
</style>

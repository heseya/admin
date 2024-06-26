<template>
  <div class="warehouse-item-modal">
    <validation-observer v-slot="{ handleSubmit }">
      <a-modal :visible="visible" width="600px" @cancel="close">
        <template #title>
          <div class="warehouse-item-modal__title">
            <span>{{ form.id ? $t('editTitle') : $t('newTitle') }}</span>

            <icon-button
              v-if="item && item.id"
              v-can="$p.Deposits.Show"
              size="small"
              data-cy="deposit-show-link"
              :to="`/items/${item.id}/deposits`"
            >
              <template #icon>
                <i class="bx bxs-package"></i>
              </template>
              {{ $t('showDeposits') }}
            </icon-button>
          </div>
        </template>

        <modal-form>
          <validated-input
            v-model="form.name"
            name="name"
            :disabled="disabled"
            type="input"
            rules="required"
            :label="$t('common.form.name').toString()"
          />

          <validated-input
            v-model="form.sku"
            name="sku"
            :disabled="disabled"
            rules="required"
            :label="$t('form.sku').toString()"
          />

          <div class="warehouse-item-modal__row">
            <app-select
              :value="unlimitedStockType"
              :label="$t('unlimitedStockType.label').toString()"
              @input="changeUnlimitedStockType"
            >
              <a-select-option
                :value="UnlimitedStockType.None"
                :label="$t(`unlimitedStockType.${UnlimitedStockType.None}`).toString()"
              >
                {{ $t(`unlimitedStockType.${UnlimitedStockType.None}`) }}
              </a-select-option>
              <a-select-option
                :value="UnlimitedStockType.Time"
                :label="$t(`unlimitedStockType.${UnlimitedStockType.Time}`).toString()"
              >
                {{ $t(`unlimitedStockType.${UnlimitedStockType.Time}`) }}
              </a-select-option>
              <a-select-option
                :value="UnlimitedStockType.Date"
                :label="$t(`unlimitedStockType.${UnlimitedStockType.Date}`).toString()"
              >
                {{ $t(`unlimitedStockType.${UnlimitedStockType.Date}`) }}
              </a-select-option>
            </app-select>

            <validated-input
              v-if="unlimitedStockType === UnlimitedStockType.Date"
              v-model="form.unlimited_stock_shipping_date"
              :disabled="disabled"
              type="datetime-local"
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
              v-if="unlimitedStockType === UnlimitedStockType.Time"
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

          <field v-if="item" :label="$t('form.quantity').toString()" data-cy="total-quantity">
            {{ item.quantity }}
          </field>

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
              type="private"
              model="items"
            />
          </template>
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button
              v-if="!disabled"
              data-cy="save-btn"
              @click="handleSubmit(saveWarehouseItem)"
            >
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Items.Remove"
              :title="$t('deleteText').toString()"
              :ok-text="$t('common.delete').toString()"
              :cancel-text="$t('common.cancel').toString()"
              @confirm="deleteWarehouseItem"
            >
              <app-button v-if="form.id" data-cy="delete-btn" type="danger">{{
                $t('common.delete')
              }}</app-button>
            </pop-confirm>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "editTitle": "Edycja przedmiotu",
    "newTitle": "Nowy przedmiot",
    "showDeposits": "Zobacz listę depozytów",
    "deleteText": "Czy na pewno chcesz usunąć ten przedmiot?",
    "form": {
      "sku": "SKU",
      "quantity": "Łączna ilość w magazynie",
      "unlimited_stock_shipping_time": "Czas wysyłki w nielimitowanej ilości",
      "unlimited_stock_shipping_time_tooltip": "Oznacza czas wysyłki w dniach przedmiotów w nielimitowanej ilości. Oznacza to, że produkt będzie można kupić, nawet jeśli nie będzie dostępny na magazynie.",
      "unlimited_stock_shipping_date": "Data wysyłki w nielimitowanej ilości",
      "unlimited_stock_shipping_date_tooltip": "Oznacza, że wysyłka będzie realizowana po danej dacie. Przedmiot ma nielimitowany stan do podanej daty włącznie. Gdy ta data minie, produkt staje się niedostępny."
    },
    "unlimitedStockType": {
      "label": "Tryb nieskończonej dostępności",
      "none": "Brak nieskończonej dostępności",
      "time": "W ilościach dni",
      "date": "Od określonej daty"
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
    "showDeposits": "Show deposits",
    "deleteText": "Are you sure you want to delete this item?",
    "form": {
      "sku": "SKU",
      "quantity": "Total quantity in stock",
      "unlimited_stock_shipping_time": "Unlimited stock shipping time",
      "unlimited_stock_shipping_time_tooltip": "Indicates the time of shipping in days before the item is unavailable. This means that the item can be purchased even if it is not available in stock.",
      "unlimited_stock_shipping_date": "Unlimited stock shipping date",
      "unlimited_stock_shipping_date_tooltip": "Indicates that the shipping will be carried out on the given date. The item will be unavailable until that date. When that date is reached, the item will be unavailable."
    },
    "unlimitedStockType": {
      "label": "Unlimited stock type",
      "none": "No unlimited stock",
      "time": "In quantities of days",
      "date": "From a given date"
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
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { WarehouseItem, WarehouseItemCreateDto } from '@heseya/store-core'

import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import Field from '@/components/Field.vue'
import ItemsAvailibility from './ItemsAvailibility.vue'
import { formatDateTimeInput, formatISO } from '@/utils/dates'

type Form = WarehouseItemCreateDto & Partial<WarehouseItem>

enum UnlimitedStockType {
  None = 'none',
  Date = 'date',
  Time = 'time',
}

export default defineComponent({
  components: { ValidationObserver, ModalForm, PopConfirm, MetadataForm, Field, ItemsAvailibility },
  props: {
    item: { type: Object as PropType<WarehouseItem | null>, default: null },
    value: { type: Object as PropType<Form>, required: true },
    visible: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },

  data: () => ({
    unlimitedStockType: UnlimitedStockType.None,
  }),

  computed: {
    form: {
      get(): Form {
        return {
          ...this.value,
          unlimited_stock_shipping_date: formatDateTimeInput(
            this.value.unlimited_stock_shipping_date,
          ),
        }
      },
      set(v: Form) {
        this.$emit('input', v)
      },
    },

    UnlimitedStockType(): typeof UnlimitedStockType {
      return UnlimitedStockType
    },
  },

  watch: {
    item() {
      if (this.item?.unlimited_stock_shipping_date)
        this.unlimitedStockType = UnlimitedStockType.Date
      else if (this.item?.unlimited_stock_shipping_time)
        this.unlimitedStockType = UnlimitedStockType.Time
      else this.unlimitedStockType = UnlimitedStockType.None
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    changeUnlimitedStockType(v: UnlimitedStockType) {
      this.unlimitedStockType = v
      this.form.unlimited_stock_shipping_time = null
      this.form.unlimited_stock_shipping_date = null
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

      const modifiedForm: Form = {
        ...this.form,
        unlimited_stock_shipping_date: formatISO(this.form.unlimited_stock_shipping_date),
      }

      if (this.form.id) {
        // Metadata can be saved only after product is created
        await this.saveMetadata(this.form.id)

        success = !!(await this.$accessor.items.update({
          id: this.form.id,
          item: modifiedForm,
        }))
      } else {
        success = !!(await this.$accessor.items.add(modifiedForm))
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

<style lang="scss">
.warehouse-item-modal {
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__row {
    display: flex;
    gap: 8px;

    @media ($max-viewport-4) {
      flex-wrap: wrap;
    }

    .input-wrapper {
      display: initial;
    }

    .app-input__input {
      margin-top: auto;
    }
  }
}
</style>

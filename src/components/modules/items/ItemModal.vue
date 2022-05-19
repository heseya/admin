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
          <validated-input
            v-if="form.id"
            v-model="form.quantity"
            :disabled="disabled"
            rules="required"
            type="number"
            :label="$t('form.quantity')"
          />

          <template v-if="item">
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
      "quantity": "Ilość w magazynie"
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
      "quantity": "Quantity in stock"
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

type Form = WarehouseItemCreateDto & Partial<WarehouseItem>

export default Vue.extend({
  components: { ValidationObserver, ModalForm, PopConfirm, MetadataForm },
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

        const quantityDiff = (this.form.quantity || 0) - this.item!.quantity
        if (quantityDiff) {
          // @ts-ignore // TODO: fix extended store actions typings
          success = await this.$accessor.items.updateQuantity({
            id: this.form.id,
            deposit: { quantity: quantityDiff },
          })
        }

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

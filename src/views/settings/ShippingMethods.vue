<template>
  <div>
    <PaginatedList
      :title="$t('title').toString()"
      store-key="shippingMethods"
      draggable
      :table="tableConfig"
    >
      <template #nav>
        <icon-button v-can="$p.ShippingMethods.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: method }">
        <cms-table-row
          :key="method.id"
          :item="method"
          :headers="tableConfig.headers"
          draggable
          @click="openModal(method.id)"
        >
          <template #countries="{ value }">
            <CmsTableCellList :items="value">
              <template #title>
                {{
                  !method.countries.length
                    ? method.is_block_list_countries
                      ? $t('list.allEnabled')
                      : $t('list.allDisabled')
                    : method.is_block_list_countries
                    ? $t('list.blockList')
                    : $t('list.allowList')
                }}
              </template>
            </CmsTableCellList>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="660px"
        :title="editedItem.id ? $t('editTitle') : $t('newTitle')"
      >
        <ShippingMethodsForm
          :key="editedItem.id || 'new'"
          v-model="editedItem"
          :countries="countries"
          :disabled="!canModify"
        />
        <template v-if="selectedItem">
          <hr />
          <MetadataForm
            ref="publicMeta"
            :value="selectedItem.metadata"
            :disabled="!canModify"
            model="shippingMethods"
          />
          <MetadataForm
            v-if="selectedItem.metadata_private"
            ref="privateMeta"
            :value="selectedItem.metadata_private"
            :disabled="!canModify"
            type="private"
            model="shippingMethods"
          />
        </template>

        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.ShippingMethods.Remove"
              :title="$t('deleteText').toString()"
              :ok-text="$t('common.delete').toString()"
              :cancel-text="$t('common.cancel').toString()"
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

<i18n lang="json">
{
  "pl": {
    "title": "Metody dostawy",
    "add": "Dodaj metodę dostawy",
    "editTitle": "Edycja metody dostawy",
    "newTitle": "Nowa metoda dostawy",
    "deleteText": "Czy na pewno chcesz usunąć tą metode dostawy?",
    "list": {
      "allEnabled": "Metoda dostepna w każdym kraju",
      "allDisabled": "Metoda niedostepna w żadnym kraju",
      "allowList": "Tylko wybrane kraje:",
      "blockList": "Wszystkie kraje poza:"
    },
    "alerts": {
      "deleted": "Metoda dostawy została usunięta.",
      "created": "Metoda dostawy została dodana.",
      "updated": "Metoda dostawy została zaktualizowana."
    },
    "headers": {
      "availabilty": "Dostępność w krajach",
      "basePrice": "Bazowa cena",
      "minShippingTime": "Minimalny czas dostawy",
      "maxShippingTime": "Maksymalny czas dostawy",
      "visibility": "Widoczność",
      "paymentOnDelivery": "Za pobraniem"
    }
  },
  "en": {
    "title": "Shipping methods",
    "add": "Add shipping method",
    "editTitle": "Edit shipping method",
    "newTitle": "New shipping method",
    "deleteText": "Are you sure you want to delete this shipping method?",
    "list": {
      "allEnabled": "Shipping method available in all countries",
      "allDisabled": "Shipping method unavailable in any country",
      "allowList": "Only selected countries:",
      "blockList": "All countries except:"
    },
    "alerts": {
      "deleted": "Shipping method has been deleted.",
      "created": "Shipping method has been created.",
      "updated": "Shipping method has been updated."
    },
    "headers": {
      "availabilty": "Availability in countries",
      "basePrice": "Base price",
      "minShippingTime": "Minimal delivery time",
      "maxShippingTime": "Maximum delivery time",
      "visibility": "Visibility",
      "paymentOnDelivery": "Payment on delivery"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import omit from 'lodash/omit'
import {
  ShippingMethod,
  ShippingType,
  ShippingMethodUpdateDto,
  ShippingCountry,
} from '@heseya/store-core'
import { sdk } from '../../api'

import PaginatedList from '@/components/PaginatedList.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ShippingMethodsForm from '@/components/modules/shippingMethods/Form.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { UUID } from '@/interfaces/UUID'
import { TableConfig } from '@/interfaces/CmsTable'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import CmsTableCellList from '@/components/cms/CmsTableCellList.vue'
import { formatPrice } from '@/utils/currency'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PopConfirm,
    ValidationObserver,
    PaginatedList,
    ShippingMethodsForm,
    MetadataForm,
    CmsTableRow,
    CmsTableCellList,
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
  data: () => ({
    isModalActive: false,
    editedItem: {} as ShippingMethodUpdateDto & { id?: UUID },
    selectedItem: null as ShippingMethod | null,
    countries: [] as ShippingCountry[],
  }),
  computed: {
    canModify(): boolean {
      return this.$can(
        this.editedItem.id ? this.$p.ShippingMethods.Edit : this.$p.ShippingMethods.Add,
      )
    },
    tableConfig(): TableConfig<ShippingMethod> {
      return {
        headers: [
          {
            key: 'name',
            label: this.$t('common.form.name') as string,
            width: '1fr',
            wordBreak: 'break-word',
          },
          {
            key: 'shipping_type',
            label: this.$t('common.form.type') as string,
            width: '1fr',
            render: (type: ShippingType) => this.$t(`shippingTypes.${type}`) as string,
          },
          {
            key: 'countries',
            label: this.$t('headers.availabilty') as string,
            width: '1.5fr',
            render: (countries: ShippingMethod['countries']) => countries.map(({ name }) => name),
            wordBreak: 'break-word',
          },
          {
            key: 'prices',
            label: this.$t('headers.basePrice') as string,
            width: '1fr',
            render: (_, method) =>
              formatPrice(
                method.prices.find((p) => p.currency === this.$accessor.config.currency) || {
                  gross: '0',
                  net: '0',
                  currency: this.$accessor.config.currency,
                },
              ),
          },
          {
            key: 'shipping_time_min',
            label: this.$t('headers.minShippingTime') as string,
            width: '1fr',
          },
          {
            key: 'shipping_time_max',
            label: this.$t('headers.maxShippingTime') as string,
            width: '1fr',
          },
          { key: 'public', label: this.$t('headers.visibility') as string, width: '0.5fr' },
          {
            key: 'payment_on_delivery',
            label: this.$t('headers.paymentOnDelivery') as string,
            width: '0.5fr',
          },
        ],
      }
    },
  },
  async created() {
    this.$accessor.startLoading()
    this.$accessor.paymentMethods.fetch()
    const countries = await sdk.ShippingMethods.getCountries()
    this.countries = countries
    this.$accessor.stopLoading()
  },
  methods: {
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        const item = this.$accessor.shippingMethods.getFromListById(id)
        this.selectedItem = item
        this.editedItem = {
          ...item,
          payment_methods: item.payment_methods.map(({ id }) => id),
          countries: item.countries.map(({ code }) => code),
          price_ranges: item.price_ranges.map(({ start, value }) => ({
            start: start.gross,
            value: value.gross,
            currency: value.currency,
          })),
          shipping_points: item.shipping_points?.map((point) => omit(point, 'id')),
        }
      } else {
        this.selectedItem = null
        this.editedItem = {
          name: '',
          shipping_type: ShippingType.Address,
          payment_methods: [],
          is_block_list_countries: false,
          countries: [],
          is_block_list_products: false,
          product_ids: [],
          product_set_ids: [],
          shipping_time_min: 1,
          shipping_time_max: 3,
          price_ranges: this.$accessor.config.currencies.map(({ code }) => ({
            start: '0',
            value: '0',
            currency: code,
          })),
          public: true,
          shipping_points: [],
          payment_on_delivery: false,
        }
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        // Metadata can be saved only after shipping method is created
        await this.saveMetadata(this.editedItem.id)

        await this.$accessor.shippingMethods.update({
          id: this.editedItem.id,
          item: {
            ...this.editedItem,
            price_ranges: this.editedItem.price_ranges.map(({ start, value, currency }) => ({
              // Ensure this is a string
              start: start.toString(),
              value: value.toString(),
              currency,
            })),
          },
        })

        this.$toast.success(this.$t('alerts.updated') as string)
      } else {
        await this.$accessor.shippingMethods.add({
          ...this.editedItem,
          price_ranges: this.editedItem.price_ranges.map(({ start, value, currency }) => ({
            // Ensure this is a string
            start: start.toString(),
            value: value.toString(),
            currency,
          })),
        })

        this.$toast.success(this.$t('alerts.created') as string)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      if (!this.editedItem.id) return
      this.$accessor.startLoading()
      await this.$accessor.shippingMethods.remove(this.editedItem.id)

      this.$toast.success(this.$t('alerts.deleted') as string)
      this.$accessor.stopLoading()
      this.isModalActive = false
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
.row {
  display: flex;
  justify-content: space-between;
}
</style>

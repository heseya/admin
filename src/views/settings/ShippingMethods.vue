<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="shippingMethods" draggable :table="tableConfig">
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
          @click="openModal(method.id)"
        >
        </cms-table-row>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="660px"
        :title="editedItem.id ? $t('editTitle') : $t('newTitle')"
      >
        <ShippingMethodsForm v-model="editedItem" :countries="countries" :disabled="!canModify" />

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
            is-private
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
      "whiteList": "Tylko wybrane kraje:",
      "blackList": "Wszystkie kraje poza:"
    },
    "alerts": {
      "deleted": "Metoda dostawy została usunięta.",
      "created": "Metoda dostawy została dodana.",
      "updated": "Metoda dostawy została zaktualizowana."
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
      "whiteList": "Only selected countries:",
      "blackList": "All countries except:"
    },
    "alerts": {
      "deleted": "Shipping method has been deleted.",
      "created": "Shipping method has been created.",
      "updated": "Shipping method has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { ShippingMethod, ShippingMethodUpdateDto, ShippingCountry } from '@heseya/store-core'
import { api } from '../../api'

import PaginatedList from '@/components/PaginatedList.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ShippingMethodsForm from '@/components/modules/shippingMethods/Index.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { UUID } from '@/interfaces/UUID'
import { TableConfig } from '@/interfaces/CmsTable'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

export default Vue.extend({
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
          { key: 'name', label: this.$t('common.form.name') as string, width: '1fr', wrap: true },
          {
            key: 'countries',
            label: 'Dostępność w krajach' as string,
            width: '1.5fr',
            render: (v: Record<string, any>[]) => v.map(({ name }) => name),
            wrap: true,
          },
          { key: 'price', label: 'bazowa cena' as string, width: '1fr' },
          { key: 'shipping_time_min', label: 'minimalny czas dostawy' as string, width: '1fr' },
          { key: 'shipping_time_max', label: 'maksymalny czas dostawy' as string, width: '1fr' },
          { key: 'public', label: 'widocznosc' as string, width: '0.5fr' },
        ],
      }
    },
  },
  async created() {
    this.$accessor.startLoading()
    this.$accessor.paymentMethods.fetch()
    const { data } = await api.get<{ data: ShippingCountry[] }>('countries')
    this.countries = data.data
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
          price_ranges: item.price_ranges.map(({ start, prices }) => ({
            start,
            value: prices[0].value,
          })),
        }
      } else {
        this.selectedItem = null
        this.editedItem = {
          name: '',
          block_list: false,
          payment_methods: [],
          countries: [],
          shipping_time_min: 0,
          shipping_time_max: 0,
          price_ranges: [
            {
              start: 0,
              value: 0,
            },
          ],
          public: true,
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
          item: this.editedItem,
        })

        this.$toast.success(this.$t('alerts.updated') as string)
      } else {
        await this.$accessor.shippingMethods.add(this.editedItem)

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

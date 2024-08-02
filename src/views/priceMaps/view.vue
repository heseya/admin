<template>
  <div class="narrower-page">
    <TopNav :title="!isNew ? priceMap.name : $t('newTitle').toString()">
      <icon-button :disabled="isNew" :to="`/settings/price-maps/${priceMap.id}/prices`">
        <template #icon>
          <i class="bx bx-list-ul"></i>
        </template>
        {{ $t('goToPrices') }}
      </icon-button>
      <PopConfirm
        v-if="!isNew"
        v-can="$p.Products.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deleteEntity"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </PopConfirm>
    </TopNav>

    <Card>
      <PriceMapForm v-model="form" :disabled="isDisabled" @submit="save" />
    </Card>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Nowy mapa cen",
    "deleteText": "Czy na pewno chcesz usunąć tą mapę cen?",
    "deletedMessage": "Mapa cen została usunięta.",
    "createdMessage": "Mapa cen została utworzona.",
    "updatedMessage": "Mapa cen została zaktualizowana.",
    "goToPrices": "Przejdź do listy cen"
  },
  "en": {
    "newTitle": "New price map",
    "deleteText": "Are you sure you want to delete this price map?",
    "deletedMessage": "Price map has been deleted",
    "createdMessage": "Price map has been created",
    "updatedMessage": "Price map has been updated",
    "goToPrices": "Go to prices list"
  }
}
</i18n>

<script lang="ts">
/**
 * TODO: replace permissions to PriceMap permissions
 */
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { PriceMap, PriceMapCreateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import PriceMapForm from '@/components/modules/priceMaps/Form.vue'

import { formatApiNotificationError } from '@/utils/errors'
import Card from '@/components/layout/Card.vue'

const EMPTY_FORM: PriceMapCreateDto = {
  name: '',
  currency: '',
  is_net: false,
}

export default defineComponent({
  metaInfo(this: any): any {
    const fallback = this.$t('newTitle') as string
    return {
      title: this.isNew ? fallback : this.PriceMap?.name || fallback,
    }
  },
  components: {
    PriceMapForm,
    TopNav,
    PopConfirm,
    Card,
  },
  data: () => ({
    form: cloneDeep(EMPTY_FORM),
  }),
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    priceMap(): PriceMap {
      return this.$accessor.priceMaps.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.priceMaps.getError
    },
    isLoading(): boolean {
      return this.$accessor.priceMaps.isLoading
    },
    isDisabled(): boolean {
      return this.isNew ? !this.$can(this.$p.Products.Add) : !this.$can(this.$p.Products.Edit)
    },
  },
  watch: {
    priceMap(priceMap: PriceMap) {
      if (!this.isNew) {
        this.form = cloneDeep({
          ...EMPTY_FORM,
          ...priceMap,
        })
      }
    },
    error(error: any) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.priceMaps.get(this.id)
      this.$accessor.stopLoading()
    }
  },
  methods: {
    async save() {
      this.$accessor.startLoading()
      const successMessage = this.isNew
        ? (this.$t('createdMessage') as string)
        : (this.$t('updatedMessage') as string)

      const form: PriceMapCreateDto = {
        ...this.form,
      }

      const PriceMap = this.isNew
        ? await this.$accessor.priceMaps.add(form)
        : await this.$accessor.priceMaps.update({ id: this.id, item: form })

      if (PriceMap) {
        this.$toast.success(successMessage)
      }

      if (PriceMap && PriceMap.id !== this.id)
        this.$router.push(`/settings/price-maps/${PriceMap.id}`)

      this.$accessor.stopLoading()
    },

    async deleteEntity() {
      this.$accessor.startLoading()
      const success = await this.$accessor.priceMaps.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('deletedMessage') as string)
        this.$router.push('/settings/price-maps')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

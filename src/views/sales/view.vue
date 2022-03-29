<template>
  <div class="sale-view narrower-page">
    <top-nav :title="!isNew ? sale.name : $t('newTitle')">
      <!-- <audits-modal :id="sale.id" model="sales" /> -->

      <pop-confirm
        v-if="!isNew"
        v-can="$p.Sales.Remove"
        :title="$t('deleteText')"
        :ok-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
        @confirm="deleteSale"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="sale-view__form">
      <validation-observer v-slot="{ handleSubmit }">
        <card>
          <SaleForm v-model="form" :disabled="!canModify" />

          <hr />
          <app-button v-if="canModify" @click="handleSubmit(save)">
            {{ $t('common.save') }}
          </app-button>
        </card>
      </validation-observer>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "newTitle": "New sale",
    "deleteText": "Are you sure, you want to delete this sale?",
    "alerts": {
      "deleted": "Sale has been deleted",
      "created": "Sale has been created",
      "updated": "Sale has been updated"
    }
  },
  "pl": {
    "newTitle": "Nowa promocja",
    "deleteText": "Jesteś pewien, że chcesz usunąć tą promocje?",
    "alerts": {
      "deleted": "Promocja została usunięta",
      "created": "Promocja została utworzona",
      "updated": "Promocja została zaktualizowana"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import SaleForm from '@/components/modules/sales/Form.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'

import { UUID } from '@/interfaces/UUID'
import {
  Sale,
  SaleFormDto,
  DiscountTargetType,
  DiscountType,
  SaleDto,
} from '@/interfaces/SalesAndCoupons'

import { formatApiNotificationError } from '@/utils/errors'
import { mapSaleFormToSaleDto } from '@/utils/sales'

const EMPTY_SALE_FORM: SaleFormDto = {
  name: '',
  description: '',
  value: 0,
  type: DiscountType.Percentage,
  priority: 0,
  condition_groups: [],
  target_type: DiscountTargetType.OrderValue,
  target_products: [],
  target_sets: [],
  target_shipping_methods: [],
  target_is_allow_list: true,
}

export default Vue.extend({
  components: { ValidationObserver, TopNav, Card, PopConfirm, SaleForm },
  data: () => ({
    form: cloneDeep(EMPTY_SALE_FORM) as SaleFormDto,
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    sale(): Sale {
      return this.$accessor.sales.getSelected
    },
    error(): any {
      return this.$accessor.sales.getError
    },
    isLoading(): boolean {
      return this.$accessor.sales.isLoading
    },
    canModify(): boolean {
      return this.$can(this.isNew ? this.$p.Sales.Add : this.$p.Sales.Edit)
    },
  },
  watch: {
    sale(sale: Sale) {
      if (!this.isNew) {
        this.form = cloneDeep({ ...EMPTY_SALE_FORM, ...sale })
      }
    },
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.sales.get(this.id)
      this.$accessor.stopLoading()
    }
  },

  methods: {
    async save() {
      this.$accessor.startLoading()

      const dto: SaleDto = mapSaleFormToSaleDto(this.form)

      if (this.isNew) {
        const sale = await this.$accessor.sales.add(dto)
        if (sale && sale.id) {
          this.$toast.success(this.$t('alerts.created') as string)
          this.$router.push(`/sales/${sale.id}`)
        }
      } else {
        const success = await this.$accessor.sales.update({
          id: this.id,
          item: dto,
        })
        if (success) {
          this.$toast.success(this.$t('alerts.updated') as string)
        }
      }
      this.$accessor.stopLoading()
    },

    async deleteSale() {
      this.$accessor.startLoading()
      const success = await this.$accessor.sales.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('alerts.deleted') as string)
        this.$router.push('/sales')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
// .sale-view {
//   &__form {
//   }
// }
</style>

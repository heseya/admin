<template>
  <div class="sale-view narrower-page">
    <top-nav :title="isNew ? $t('newTitle').toString() : $t('edit').toString()">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Sales.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
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
          <SaleForm v-model="form" :disabled="!canModify" :forced-condition="forcedCondition" />
          <hr />

          <template v-if="!isNew">
            <MetadataForm
              ref="publicMeta"
              :value="sale.metadata"
              :disabled="!canModify"
              model="sales"
            />
            <MetadataForm
              v-if="sale.metadata_private"
              ref="privateMeta"
              :value="sale.metadata_private"
              :disabled="!canModify"
              type="private"
              model="sales"
            />
          </template>

          <hr />
          <app-button v-if="canModify" @click="handleSubmit(save)">
            {{ $t('common.save') }}
          </app-button>
        </card>
      </validation-observer>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "newTitle": "New sale",
    "edit": "Edit sale",
    "deleteText": "Are you sure, you want to delete this sale?",
    "saleStatus": "Sale status",
    "alerts": {
      "deleted": "Sale has been deleted",
      "created": "Sale has been created",
      "updated": "Sale has been updated"
    }
  },
  "pl": {
    "newTitle": "Nowa promocja",
    "edit": "Edytuj promocję",
    "deleteText": "Jesteś pewien, że chcesz usunąć tą promocje?",
    "saleStatus": "Status promocji",
    "alerts": {
      "deleted": "Promocja została usunięta",
      "created": "Promocja została utworzona",
      "updated": "Promocja została zaktualizowana"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'
import {
  DiscountCondition,
  DiscountConditionType,
  DiscountTargetType,
  Role,
  Sale,
} from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import SaleForm from '@/components/modules/sales/Form.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { UUID } from '@/interfaces/UUID'
import { SaleFormDto } from '@/interfaces/SalesAndCoupons'
import { formatApiNotificationError } from '@/utils/errors'
import { mapSaleFormToSaleDto } from '@/utils/sales'
import { mapPricesToDto } from '@/utils/currency'

const createB2BCondition = (company: Role): DiscountCondition => ({
  id: '',
  type: DiscountConditionType.UserInRole,
  roles: [company],
  is_allow_list: true,
})

const EMPTY_SALE_FORM: SaleFormDto = {
  slug: '',
  percentage: '0',
  amounts: undefined,
  active: true,
  priority: 0,
  condition_groups: [],
  target_type: DiscountTargetType.OrderValue,
  target_products: [],
  target_sets: [],
  target_shipping_methods: [],
  target_is_allow_list: true,
  seo: undefined,
  published: [],
  translations: {},
}

export default defineComponent({
  components: { ValidationObserver, TopNav, Card, PopConfirm, SaleForm, MetadataForm },
  metaInfo(this: any): any {
    return {
      title: this.isNew
        ? this.$t('newTitle').toString()
        : this.sale?.name || this.$t('edit').toString(),
    }
  },
  data: () => ({
    form: cloneDeep(EMPTY_SALE_FORM) as SaleFormDto,
    b2bCompany: null as Role | null,
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    sale(): Sale {
      return this.$accessor.sales.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.sales.getError
    },
    isLoading(): boolean {
      return this.$accessor.sales.isLoading || this.$accessor.b2bCompanies.isLoading
    },
    canModify(): boolean {
      return this.$can(this.isNew ? this.$p.Sales.Add : this.$p.Sales.Edit)
    },

    forcedCondition(): DiscountCondition | null {
      if (!this.b2bCompany) return null
      return createB2BCondition(this.b2bCompany)
    },
  },
  watch: {
    sale(sale: Sale) {
      if (!this.isNew)
        this.form = cloneDeep({
          ...EMPTY_SALE_FORM,
          ...sale,
          amounts: sale.amounts ? mapPricesToDto(sale.amounts) : null,
        }) as SaleFormDto
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

    // Ensure B2B condition group will be enforced
    if (this.$route.query.company || (!this.isNew && this.sale?.metadata?.b2b_company)) {
      await this.fetchB2BCompany(
        (this.$route.query.company as string) || (this.sale?.metadata?.b2b_company as string),
      )
    }
  },

  methods: {
    async fetchB2BCompany(companyId: UUID) {
      const company = await this.$accessor.b2bCompanies.get(companyId)
      if (company) this.b2bCompany = company
    },

    async save() {
      this.$accessor.startLoading()

      const dto = mapSaleFormToSaleDto(this.form)
      if (this.isNew && this.$route.query.company) {
        dto.metadata = { b2b_company: this.$route.query.company as UUID }
      }

      if (this.isNew) {
        const sale = await this.$accessor.sales.add(dto)
        if (sale && sale.id) {
          this.$toast.success(this.$t('alerts.created') as string)
          this.$router.push(`/sales/${sale.id}`)
        }
      } else {
        // Metadata can be saved only after product is created
        await this.saveMetadata(this.id)

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
.sale-status {
  display: flex;
  align-items: center;
  margin: 3px 0;

  .section-title {
    margin: 0 20px 0 0;
  }
}
.section-title {
  font-size: 15px;
  line-height: 19px;
  font-weight: 600;
}
</style>

<template>
  <div class="sale-view narrower-page">
    <top-nav :title="isNew ? $t('newTitle') : $t('edit')">
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
              is-private
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
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'
import {
  DiscountConditionGroup,
  DiscountConditionType,
  DiscountTargetType,
  DiscountType,
  Role,
  Sale,
  SaleCreateDto,
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

const createB2BConditionGroup = (company: Role): DiscountConditionGroup & { forced: true } => ({
  id: '',
  conditions: [
    {
      id: '',
      type: DiscountConditionType.UserInRole,
      roles: [company],
      is_allow_list: true,
    },
  ],
  forced: true,
})

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
  components: { ValidationObserver, TopNav, Card, PopConfirm, SaleForm, MetadataForm },
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
      return this.$accessor.sales.getSelected || ({} as any)
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

        // Lock B2B condition group
        if (sale.metadata.b2b_company) {
          const b2bConditionIndex = sale.condition_groups.findIndex(
            ({ conditions }) =>
              conditions.length === 1 &&
              conditions[0].type === DiscountConditionType.UserInRole &&
              conditions[0].roles.length === 1 &&
              conditions[0].roles[0].id === sale.metadata.b2b_company,
          )
          if (b2bConditionIndex < 0) {
            this.appendB2BConditionGroup(sale.metadata.b2b_company as string)
            return
          }
          const b2bCondition = cloneDeep({
            ...sale.condition_groups[b2bConditionIndex],
            forced: true,
          })
          const b2bSale = {
            ...sale,
            condition_groups: [
              ...sale.condition_groups.slice(0, b2bConditionIndex),
              b2bCondition,
              ...sale.condition_groups.slice(b2bConditionIndex + 1),
            ],
          }
          this.form = cloneDeep({ ...EMPTY_SALE_FORM, ...b2bSale })
        }
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

    // Append B2B condition group
    if (this.isNew && this.$route.query.company) {
      await this.appendB2BConditionGroup(this.$route.query.company as string)
    }
  },

  methods: {
    async appendB2BConditionGroup(companyId: UUID) {
      const company = await this.$accessor.b2bCompanies.get(companyId)
      if (company && company.metadata.b2b_company)
        this.form.condition_groups.push(createB2BConditionGroup(company))
    },

    async save() {
      this.$accessor.startLoading()

      const dto: SaleCreateDto = mapSaleFormToSaleDto(this.form)
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
// .sale-view {
//   &__form {
//   }
// }
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

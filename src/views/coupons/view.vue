<template>
  <div class="coupon-view narrower-page">
    <top-nav :title="!isNew ? coupon.name : $t('newTitle')">
      <!-- <audits-modal :id="coupon.id" model="coupons" /> -->

      <pop-confirm
        v-if="!isNew"
        v-can="$p.Coupons.Remove"
        :title="$t('deleteText')"
        :ok-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
        @confirm="deleteCoupon"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="coupon-view__form">
      <validation-observer v-slot="{ handleSubmit }">
        <card>
          <validated-input
            v-model="form.code"
            rules="required"
            :label="$t('formCode')"
            :disabled="!canModify"
          />

          <hr />

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
    "newTitle": "New coupon",
    "deleteText": "Are you sure, you want to delete this coupon?",
    "alerts": {
      "deleted": "Coupon has been deleted",
      "created": "Coupon has been created",
      "updated": "Coupon has been updated"
    },
    "formCode": "Code"
  },
  "pl": {
    "newTitle": "Nowy kod rabatowy",
    "deleteText": "Jesteś pewien, że chcesz usunąć ten kod rabatowy?",
    "alerts": {
      "deleted": "Kod rabatowy został usunięty",
      "created": "Kod rabatowy został utworzony",
      "updated": "Kod rabatowy został zaktualizowany"
    },
    "formCode": "Kod"
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

import { UUID } from '@/interfaces/UUID'
import {
  Coupon,
  CouponDto,
  CouponFormDto,
  DiscountTargetType,
  DiscountType,
} from '@/interfaces/SalesAndCoupons'

import { formatApiNotificationError } from '@/utils/errors'
import PopConfirm from '@/components/layout/PopConfirm.vue'

const EMPTY_COUPON_FORM: CouponFormDto = {
  code: '',
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
  target_is_allow_list: false,
}

export default Vue.extend({
  components: { ValidationObserver, TopNav, Card, PopConfirm, SaleForm },
  data: () => ({
    form: cloneDeep(EMPTY_COUPON_FORM) as CouponFormDto,
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    coupon(): Coupon {
      return this.$accessor.coupons.getSelected
    },
    error(): any {
      return this.$accessor.coupons.getError
    },
    isLoading(): boolean {
      return this.$accessor.coupons.isLoading
    },
    canModify(): boolean {
      return this.$can(this.isNew ? this.$p.Coupons.Add : this.$p.Coupons.Edit)
    },
  },
  watch: {
    coupon(coupon: Coupon) {
      if (!this.isNew) {
        this.form = cloneDeep({ ...EMPTY_COUPON_FORM, ...coupon })
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
      await this.$accessor.coupons.get(this.id)
      this.$accessor.stopLoading()
    }
  },

  methods: {
    async save() {
      this.$accessor.startLoading()
      const dto: CouponDto = {
        ...cloneDeep(this.form),
        target_products: this.form.target_products.map(({ id }) => id),
        target_sets: this.form.target_sets.map(({ id }) => id),
        target_shipping_methods: this.form.target_shipping_methods.map(({ id }) => id),
      }

      if (this.isNew) {
        const coupon = await this.$accessor.coupons.add(dto)
        if (coupon && coupon.id) {
          this.$toast.success(this.$t('alerts.created') as string)
          this.$router.push(`/coupons/${coupon.id}`)
        }
      } else {
        const success = await this.$accessor.coupons.update({
          id: this.id,
          item: dto,
        })
        if (success) {
          this.$toast.success(this.$t('alerts.updated') as string)
        }
      }
      this.$accessor.stopLoading()
    },

    async deleteCoupon() {
      this.$accessor.startLoading()
      const success = await this.$accessor.coupons.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('alerts.deleted') as string)
        this.$router.push('/coupons')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
// .coupon-view {
//   &__form {
//   }
// }
</style>

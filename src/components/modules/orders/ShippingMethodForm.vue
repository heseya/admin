<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <app-select
        v-model="form.shipping_method_id"
        option-filter-prop="label"
        :label="$t('method')"
      >
        <a-select-option v-for="method in shippingMethods" :key="method.id" :label="method.name">
          {{ method.name }}
        </a-select-option>
      </app-select>

      <address-form v-if="shippingType === ShippingType.Address" v-model="form.shipping_place" />

      <app-select
        v-if="shippingType === ShippingType.Point"
        v-model="form.shipping_place"
        option-filter-prop="label"
        :label="$t('shippingPoint')"
      >
        <a-select-option v-for="point in shippingPoints" :key="point.id" :label="point.name">
          {{ point.name }}
        </a-select-option>
      </app-select>

      <validated-input
        v-else-if="shippingType === ShippingType.PointExternal"
        v-model="form.shipping_place"
        name="shipping_place"
        :label="$t('externalPointId')"
        rules="required"
      />
      <div class="center">
        <app-button type="primary" @click="handleSubmit(changeShippingMethod)">
          {{ $t('common.save') }}
        </app-button>
      </div>
    </ValidationObserver>
  </div>
</template>

<i18n>
{
  "en": {
    "method": "Shipping method",
    "changeSuccess": "Changed shipping method",
    "externalPointId": "External point ID",
    "shippingPoint": "Shipping Point"
  },
  "pl": {
    "method": "Metoda dostawy",
    "changeSuccess": "Zmieniono metodę dostawy",
    "externalPointId": "Identyfikator zewnętrznego punktu",
    "shippingPoint": "Punkt dostawy"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { cloneDeep, isString } from 'lodash'

import AddressForm from './AddressForm.vue'

import { ShippingMethod, ShippingType } from '@/interfaces/ShippingMethod'
import { AddressDto } from '@/interfaces/Address'
import { UUID } from '@/interfaces/UUID'
import { Order } from '@/interfaces/Order'
import { DEFAULT_ADDRESS_FORM } from '@/consts/addressConsts'

interface ShippingMethodUpdate {
  // eslint-disable-next-line camelcase
  shipping_method_id?: UUID
  // eslint-disable-next-line camelcase
  shipping_place?: AddressDto | string
}

export default Vue.extend({
  components: { AddressForm, ValidationObserver },
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
  },
  data: () => ({
    form: {} as ShippingMethodUpdate,
    shippingType: '' as ShippingType,
    shippingPoints: [] as AddressDto[],
  }),
  computed: {
    ShippingType(): typeof ShippingType {
      return ShippingType
    },
    shippingMethods(): ShippingMethod[] {
      return this.$accessor.shippingMethods.getData
    },
  },
  watch: {
    'form.shipping_method_id': {
      handler(newMethodId) {
        const newMethod = this.shippingMethods.find((method) => method.id === newMethodId)
        if (newMethod?.shipping_type) {
          switch (newMethod?.shipping_type) {
            case ShippingType.None:
              this.form.shipping_place = undefined
              break
            case ShippingType.Address:
              this.form.shipping_place = { ...cloneDeep(DEFAULT_ADDRESS_FORM) }
              break
            case ShippingType.Point:
              this.shippingPoints = newMethod.shipping_points as AddressDto[]
              if (!isString(this.form.shipping_place)) {
                this.form.shipping_place = this.shippingPoints[0].id
              } else {
                if (!this.isValidPointId(this.form.shipping_place)) {
                  this.form.shipping_place = this.shippingPoints[0].id
                }
              }
              break
            case ShippingType.PointExternal:
              this.form.shipping_place = ''
              break
          }
          this.shippingType = newMethod?.shipping_type
        }
      },
      deep: true,
    },
  },

  created() {
    this.$accessor.shippingMethods.fetch()
    this.form = {
      shipping_method_id: this.order.shipping_method_id,
      shipping_place:
        this.order.shipping_type === ShippingType.Point
          ? (this.order.shipping_place as AddressDto).id
          : this.order.shipping_place,
    }
    this.shippingType = this.order.shipping_type
    this.shippingPoints = this.order.shipping_method.shipping_points as AddressDto[]
  },
  methods: {
    async changeShippingMethod() {
      this.$accessor.startLoading()
      const success = await this.$accessor.orders.update({ id: this.order.id, item: this.form })
      if (success) this.$toast.success(this.$t('changeSuccess') as string)
      else this.$toast.error(this.$t('editFailed') as string)
      this.$accessor.stopLoading()
    },
    findShippingMethod(shippingMethodId: string) {
      return this.shippingMethods.find((method) => shippingMethodId === method.id)
    },
    isValidPointId(pointId: string) {
      const selectedShippingMethod = this.findShippingMethod(this.form.shipping_method_id as string)
      return (selectedShippingMethod?.shipping_points as AddressDto[]).find(
        (point: AddressDto) => pointId === point.id,
      )
    },
  },
})
</script>

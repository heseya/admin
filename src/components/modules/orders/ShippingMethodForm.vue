<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <app-select
        v-model="form.shipping_method_id"
        option-filter-prop="label"
        :label="$t('method')"
      >
        <a-select-option
          v-for="method in shippingMethods"
          :key="method.id"
          :label="method.name"
          :disabled="isShippingMethodDisabled(method)"
        >
          {{ method.name }}

          <info-tooltip v-if="isShippingMethodDisabled(method)">
            {{ $t('disabledMethodInfo') }}
          </info-tooltip>
        </a-select-option>
      </app-select>

      <AddressForm v-if="shippingType === ShippingType.Address" v-model="form.shipping_place" />

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
        rules="required"
      >
        <template #label>
          {{ $t('pointExternalId') }}
          <info-tooltip> {{ $t('pointExternalInfo') }}</info-tooltip>
        </template>
      </validated-input>
      <div class="center">
        <app-button type="primary" @click="handleSubmit(changeShippingMethod)">
          {{ $t('common.save') }}
        </app-button>
      </div>
    </ValidationObserver>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "method": "Shipping method",
    "changeSuccess": "Changed shipping method",
    "editFailed": "Failed to change shipping method",
    "pointExternalId": "External point ID",
    "shippingPoint": "Shipping Point",
    "pointExternalInfo": "External point ID can be used by integration to send parcels",
    "disabledMethodInfo": "Shipping method is disabled because it has no shipping points"
  },
  "pl": {
    "method": "Metoda dostawy",
    "changeSuccess": "Zmieniono metodę dostawy",
    "editFailed": "Nie udało się zmienić metody dostawy",
    "pointExternalId": "Zewnętrzny identyfikator punktu",
    "shippingPoint": "Punkt dostawy",
    "pointExternalInfo": "Zewnętrzny identyfikator punktu może być używany przez integracje do nadawania paczek",
    "disabledMethodInfo": "Metoda dostawy jest niedostępna, ponieważ nie posiada żadnych punktów dostawy"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { cloneDeep, isString } from 'lodash'
import { Address, AddressDto, Order, ShippingMethod, ShippingType } from '@heseya/store-core'

import AddressForm from './AddressForm.vue'

import { UUID } from '@/interfaces/UUID'
import { DEFAULT_ADDRESS_FORM } from '@/consts/addressConsts'

interface ShippingMethodUpdate {
  shipping_method_id?: UUID
  shipping_place?: AddressDto | string
}

export default defineComponent({
  components: { AddressForm, ValidationObserver },
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
    digital: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    form: {} as ShippingMethodUpdate,
    shippingType: '' as ShippingType,
    shippingPoints: [] as Address[],
  }),
  computed: {
    ShippingType(): typeof ShippingType {
      return ShippingType
    },
    shippingMethods(): ShippingMethod[] {
      return this.$accessor.shippingMethods.getData.filter((method) =>
        this.digital
          ? method.shipping_type === ShippingType.Digital
          : method.shipping_type !== ShippingType.Digital,
      )
    },
  },
  watch: {
    'form.shipping_method_id': {
      handler(newMethodId, prevMethodId) {
        if (!prevMethodId) return
        const prevMethod = this.shippingMethods.find((method) => method.id === prevMethodId)
        const newMethod = this.shippingMethods.find((method) => method.id === newMethodId)

        // Dont clear form if shipping type is the same and it is not a point
        if (
          newMethod?.shipping_type === prevMethod?.shipping_type &&
          newMethod?.shipping_type !== ShippingType.Point
        )
          return

        if (newMethod?.shipping_type) {
          switch (newMethod?.shipping_type) {
            case ShippingType.Digital:
              this.form.shipping_place = undefined
              break
            case ShippingType.Address:
              this.form.shipping_place = { ...cloneDeep(DEFAULT_ADDRESS_FORM) }
              break
            case ShippingType.Point:
              this.shippingPoints = newMethod.shipping_points
              if (!isString(this.form.shipping_place)) {
                this.form.shipping_place = this.shippingPoints[0]?.id
              } else {
                if (!this.isValidPointId(this.form.shipping_place)) {
                  this.form.shipping_place = this.shippingPoints[0]?.id
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

  async created() {
    await this.$accessor.shippingMethods.fetch()
    const method = this.digital ? this.order.digital_shipping_method! : this.order.shipping_method!

    this.form = {
      shipping_method_id: method?.id,
      shipping_place:
        method?.shipping_type === ShippingType.Point
          ? (this.order.shipping_place as Address).id
          : this.order.shipping_place,
    }
    this.shippingType = method?.shipping_type

    this.shippingPoints =
      this.$accessor.shippingMethods.data.find(
        (method) => method.id === this.form.shipping_method_id,
      )?.shipping_points ?? []
  },
  methods: {
    isShippingMethodDisabled(method: ShippingMethod) {
      return method.shipping_type === ShippingType.Point && method.shipping_points.length === 0
    },

    async changeShippingMethod() {
      this.$accessor.startLoading()
      const form: ShippingMethodUpdate = {
        [this.digital ? 'digital_shipping_method_id' : 'shipping_method_id']:
          this.form.shipping_method_id,
        shipping_place: this.form.shipping_place,
      }
      const success = await this.$accessor.orders.update({ id: this.order.id, item: form })
      if (success) {
        this.$toast.success(this.$t('changeSuccess') as string)
        this.$emit('success')
      } else this.$toast.error(this.$t('editFailed') as string)
      this.$accessor.stopLoading()
    },
    findShippingMethod(shippingMethodId: string) {
      return this.shippingMethods.find((method) => shippingMethodId === method.id)
    },
    isValidPointId(pointId: string) {
      const selectedShippingMethod = this.findShippingMethod(this.form.shipping_method_id as string)
      return selectedShippingMethod?.shipping_points?.find((point) => pointId === point.id)
    },
  },
})
</script>

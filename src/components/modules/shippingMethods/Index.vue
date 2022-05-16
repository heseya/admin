<template>
  <div class="shipping-methods-form">
    <modal-form>
      <div class="center">
        <app-select
          v-model="form.shipping_type"
          :disabled="disabled"
          option-filter-prop="label"
          :label="$t('form.shippingType')"
        >
          <a-select-option
            v-for="type in Object.values(ShippingType)"
            :key="type"
            :label="$t(`shippingTypes.${type}`)"
          >
            {{ $t(`shippingTypes.${type}`) }}
          </a-select-option>
        </app-select>
      </div>
      <validated-input
        v-model="form.name"
        :disabled="disabled"
        rules="required"
        :label="$t('common.form.name')"
      />
      <div class="center">
        <app-select
          v-model="form.payment_methods"
          :disabled="disabled"
          mode="multiple"
          option-filter-prop="label"
          :label="$t('form.paymentMethods')"
        >
          <a-select-option v-for="method in paymentMethods" :key="method.id" :label="method.name">
            {{ method.name }}
          </a-select-option>
        </app-select>
      </div>

      <div class="center">
        <flex-input>
          <label class="title">{{ $t('form.public') }}</label>
          <switch-input v-model="form.public" :disabled="disabled"> </switch-input>
        </flex-input>
      </div>

      <hr />

      <validation-provider ref="priceRange" v-slot="{ errors }" rules="price-ranges-duplicates">
        <PriceRangesForm v-model="form.price_ranges" :disabled="disabled" :error="errors[0]" />
      </validation-provider>

      <hr />

      <h5>{{ $t('form.deliveryTime') }}</h5>
      <div class="row">
        <validated-input
          v-model="form.shipping_time_min"
          type="number"
          min="0"
          name="shipping_time_min"
          :disabled="disabled"
          rules="not-negative|less-than:@shipping_time_max"
          :label="$t('form.minDeliveryDays')"
        />
        <validated-input
          v-model="form.shipping_time_max"
          type="number"
          min="0"
          name="shipping_time_max"
          :disabled="disabled"
          rules="not-negative"
          :label="$t('form.maxDeliveryDays')"
        />
      </div>

      <hr />

      <h5>{{ $t('form.deliveryRegions') }}</h5>
      <div class="center">
        <flex-input>
          <label class="title">{{ $t('common.allowList') }}</label>
          <a-switch v-model="form.block_list" :disabled="disabled" />
          <label class="title">{{ $t('common.blockList') }}</label>
        </flex-input>
      </div>

      <div class="center">
        <app-select
          v-model="form.countries"
          :disabled="disabled"
          mode="multiple"
          :label="$t('form.countries')"
          option-filter-prop="label"
        >
          <a-select-option v-for="country in countries" :key="country.code" :label="country.name">
            {{ country.name }}
          </a-select-option>
        </app-select>
      </div>

      <template v-if="form.shipping_type === ShippingType.Point">
        <hr />
        <h5>{{ $t('form.addShippingPoints') }}</h5>
        <ShippingPointsGrid
          :shipping-points="form.shipping_points"
          @edit="edit"
          @remove="removePoint"
        />

        <icon-button @click="add">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('form.addNewPoint') }}
        </icon-button>
      </template>
    </modal-form>
    <a-modal
      v-model="isShippingPointModalOpen"
      width="500px"
      :footer="null"
      :title="shippingPointEditMode ? $t('form.editPoint') : $t('form.addNewPoint')"
    >
      <ShippingPointForm
        :countries="countries"
        :shipping-points="form.shipping_points"
        :is-open="isShippingPointModalOpen"
        :edited-point="editedPoint"
        :edit-mode="shippingPointEditMode"
        @added="addNewPoint"
        @edited="editPoint"
        @close="isShippingPointModalOpen = false"
      />
    </a-modal>
  </div>
</template>

<i18n>
{
  "pl": {
    "form": {
      "shippingType":"Typ dostawy",
      "paymentMethods": "Dostępne metody płatności",
      "public": "Widoczność opcji dostawy",
      "deliveryTime": "Czas dostawy",
      "minDeliveryDays": "Minimalna ilość dni dostawy",
      "maxDeliveryDays": "Maksymalna ilość dni dostawy",
      "deliveryRegions": "Wysyłka możliwa do",
      "countries": "Kraje",
      "addShippingPoints": "Dodaj punkty dostawy",
      "shippingPoints":"Punkty dostawy",
      "addNewPoint":"Dodaj nowy punkt",
      "editPoint": "Edytuj punkt"
    }
  },
  "en": {
    "form": {
      "shippingType":"Shipping type",
      "paymentMethods": "Available payment methods",
      "public": "Shipping option visibility",
      "deliveryTime": "Delivery time",
      "minDeliveryDays": "Minimal number of days of delivery",
      "maxDeliveryDays": "Maximum number of days of delivery",
      "deliveryRegions": "Delivery is possible to",
      "countries": "Countries",
      "addShippingPoints": "Add shipping points",
      "shippingPoints":"Shipping points",
      "addNewPoint":"Add shipping point",
      "editPoint": "Edit point"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import ModalForm from '@/components/form/ModalForm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PriceRangesForm from './PriceRangesForm.vue'
import ShippingPointForm from './ShippingPoint.vue'
import ShippingPointsGrid from './ShippingPointsGrid.vue'

import { ShippingType, ShippingMethodCountry, ShippingMethodDTO } from '@/interfaces/ShippingMethod'
import { PaymentMethod } from '@/interfaces/PaymentMethod'
import { AddressDto } from '@/interfaces/Address'
import { DEFAULT_ADDRESS_FORM } from '@/consts/addressConsts'

export default Vue.extend({
  name: 'ShippingMethodsForm',
  components: {
    ModalForm,
    FlexInput,
    ValidationProvider,
    SwitchInput,
    PriceRangesForm,
    ShippingPointForm,
    ShippingPointsGrid,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ShippingMethodDTO>,
    countries: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ShippingMethodCountry[]>,
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    isShippingPointModalOpen: false,
    shippingPointEditMode: false,
    editedPoint: {} as AddressDto,
    oldPointName: '',
  }),
  computed: {
    form: {
      get(): ShippingMethodDTO {
        return this.value
      },
      set(value: ShippingMethodDTO) {
        this.$emit('input', value)
      },
    },
    paymentMethods(): PaymentMethod[] {
      return this.$accessor.paymentMethods.getData
    },
    ShippingType(): typeof ShippingType {
      return ShippingType
    },
  },
  watch: {
    'form.price_ranges': {
      deep: true,
      handler() {
        // @ts-ignore
        this.$refs.priceRange.validate()
      },
    },
  },
  methods: {
    add() {
      this.editedPoint = { ...DEFAULT_ADDRESS_FORM }
      this.shippingPointEditMode = false
      this.isShippingPointModalOpen = true
    },
    edit(v: AddressDto) {
      this.oldPointName = v.name
      this.editedPoint = { ...v }
      this.shippingPointEditMode = true
      this.isShippingPointModalOpen = true
    },
    addNewPoint(v: AddressDto) {
      this.form?.shipping_points?.push(v)
      this.isShippingPointModalOpen = false
    },
    editPoint(v: AddressDto) {
      this.form.shipping_points = this.form?.shipping_points?.filter(
        (point) => point.name !== this.oldPointName,
      )
      this.addNewPoint(v)
    },
    removePoint(v: AddressDto) {
      this.form.shipping_points = this.form?.shipping_points?.filter(
        (point) => point.name !== v.name,
      )
    },
  },
})
</script>

<style lang="scss">
.shipping-methods-form {
  .switch-input {
    margin-top: 0;
  }

  label.title {
    margin: 0 6px;
  }

  .ant-switch {
    background-color: $background-color-600;
  }
  .ant-switch-checked {
    background-color: #000000;
  }
}
</style>

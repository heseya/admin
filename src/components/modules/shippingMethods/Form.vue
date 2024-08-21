<template>
  <div class="shipping-methods-form">
    <modal-form>
      <div class="shipping-methods-form__header">
        <MediaUploadInput
          :disabled="disabled"
          :media="form.logo || undefined"
          :file-name="$t('form.logo').toString()"
          @upload="changeMedia"
        />

        <div>
          <div class="center">
            <app-select
              v-model="form.shipping_type"
              :disabled="disabled"
              option-filter-prop="label"
              :label="$t('form.shippingType').toString()"
            >
              <a-select-option
                v-for="shippingType in Object.values(ShippingType)"
                :key="shippingType"
                :label="$t(`shippingTypes.${shippingType}`)"
              >
                {{ $t(`shippingTypes.${shippingType}`) }}
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
            <flex-input>
              <label class="title">{{ $t('form.paymentBeforeDelivery') }}</label>
              <a-switch v-model="form.payment_on_delivery" :disabled="disabled" />
              <label class="title">{{ $t('form.paymentOnDelivery') }}</label>
            </flex-input>
          </div>

          <div v-show="!form.payment_on_delivery" class="center">
            <app-select
              v-model="form.payment_methods"
              :disabled="disabled"
              mode="multiple"
              option-filter-prop="label"
              :label="$t('form.paymentMethods')"
            >
              <a-select-option
                v-for="method in paymentMethods"
                :key="method.id"
                :label="method.name"
              >
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
        </div>
      </div>

      <hr />

      <ValidationProvider
        v-for="currency in $accessor.config.currencies"
        :key="currency.code"
        ref="priceRange"
        v-slot="{ errors }"
        :rules="`price-ranges-duplicates:${currency.code}`"
      >
        <PriceRangesForm
          v-model="form.price_ranges"
          :disabled="disabled"
          :error="errors[0]"
          :currency="currency"
        />
      </ValidationProvider>

      <hr />

      <h5>{{ $t('form.deliveryTime') }}</h5>
      <div class="row">
        <validated-input
          v-model="form.shipping_time_min"
          type="number"
          :min="0"
          name="shipping_time_min"
          :disabled="disabled"
          rules="not-negative|less-or-equal-than:@shipping_time_max"
          :label="$t('form.minDeliveryDays')"
        />
        <validated-input
          v-model="form.shipping_time_max"
          type="number"
          :min="0"
          name="shipping_time_max"
          :disabled="disabled"
          rules="not-negative"
          :label="$t('form.maxDeliveryDays')"
        />
      </div>

      <hr />

      <h5>
        {{
          form.is_block_list_countries
            ? $t('form.deliveryRegionsBlockList')
            : $t('form.deliveryRegionsAllowList')
        }}
      </h5>
      <div class="center">
        <flex-input>
          <label class="title">{{ $t('common.allowList') }}</label>
          <a-switch v-model="form.is_block_list_countries" :disabled="disabled" />
          <label class="title">{{ $t('common.blockList') }}</label>
        </flex-input>
      </div>
      <div class="center">
        <CountriesSelect
          v-model="form.countries"
          :disabled="disabled"
          :label="$t('form.countries').toString()"
          :block-list="form.is_block_list_countries"
        />
      </div>

      <hr />

      <h5>
        {{
          form.is_block_list_products ? $t('form.productsBlockList') : $t('form.productsAllowList')
        }}
      </h5>
      <div class="center">
        <flex-input>
          <label class="title">{{ $t('common.allowList') }}</label>
          <a-switch v-model="form.is_block_list_products" :disabled="disabled" />
          <label class="title">{{ $t('common.blockList') }}</label>
        </flex-input>
      </div>

      <AutocompleteInput
        v-model="form.product_ids"
        :label="$t('form.products').toString()"
        prop-mode="id"
        model-url="products"
        :disabled="disabled"
        :rules="{ required: !form.is_block_list_products && !form.product_set_ids?.length }"
      />

      <AutocompleteInput
        v-model="form.product_set_ids"
        prop-mode="id"
        model-url="product-sets"
        :label="$t('form.productSets').toString()"
        :disabled="disabled"
        :limit="500"
        :rules="{ required: !form.is_block_list_products && !form.product_ids?.length }"
      />

      <template v-if="form.shipping_type === ShippingType.Point">
        <hr />
        <h5>{{ $t('form.addShippingPoints') }}</h5>
        <ShippingPointsGrid
          :shipping-points="form.shipping_points || []"
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
      :title="isShippingPointEditMode ? $t('form.editPoint') : $t('form.addNewPoint')"
    >
      <ShippingPointForm
        v-if="isShippingPointModalOpen"
        v-model="editedPoint"
        :countries="countries"
        :shipping-points="form.shipping_points || []"
        :edit-mode="isShippingPointEditMode"
        :old-name="oldPointName"
        @added="addNewPoint"
        @edited="editPoint"
        @close="isShippingPointModalOpen = false"
      />
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "logo": "logo metody dostawy",
      "shippingType": "Typ dostawy",
      "paymentMethods": "Dostępne metody płatności",
      "public": "Widoczność metody dostawy",
      "deliveryTime": "Czas dostawy",
      "minDeliveryDays": "Minimalna ilość dni dostawy",
      "maxDeliveryDays": "Maksymalna ilość dni dostawy",
      "deliveryRegionsAllowList": "Wysyłka możliwa wyłącznie do",
      "deliveryRegionsBlockList": "Kraje do których wysyłka będzie zablokowana (pozostałe kraje będą dozwolone)",
      "countries": "Kraje",
      "productsAllowList": "Wysyłka możliwa wyłącznie dla wybranych produktów i kolekcji",
      "productsBlockList": "Wysyłka zablokowana dla wybranych produktów i kolekcji",
      "products": "Produkty",
      "productSets": "Kolekcje",
      "addShippingPoints": "Dodaj punkty dostawy",
      "shippingPoints": "Punkty dostawy",
      "addNewPoint": "Dodaj nowy punkt",
      "editPoint": "Edytuj punkt",
      "paymentOnDelivery": "Płatność przy odbiorze",
      "paymentBeforeDelivery": "Płatność przed wysyłką"
    }
  },
  "en": {
    "form": {
      "logo": "shipping method logo",
      "shippingType": "Shipping type",
      "paymentMethods": "Available payment methods",
      "public": "Shipping method visibility",
      "deliveryTime": "Delivery time",
      "minDeliveryDays": "Minimal number of days of delivery",
      "maxDeliveryDays": "Maximum number of days of delivery",
      "deliveryRegionsAllowList": "Delivery allowed only to",
      "deliveryRegionsBlockList": "Countries to which delivery will be blocked (other countries will be allowed)",
      "countries": "Countries",
      "productsAllowList": "Shipping possible only for selected products and collections",
      "productsBlockList": "Shipping blocked for selected products and collections",
      "products": "Products",
      "productSets": "Collections",
      "addShippingPoints": "Add shipping points",
      "shippingPoints": "Shipping points",
      "addNewPoint": "Add shipping point",
      "editPoint": "Edit point",
      "paymentOnDelivery": "Payment on delivery",
      "paymentBeforeDelivery": "Payment before delivery"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationProvider } from 'vee-validate'
import {
  PaymentMethod,
  ShippingCountry,
  ShippingMethodCreateDto,
  AddressDto,
  ShippingType,
  CdnMedia,
} from '@heseya/store-core'

import ModalForm from '@/components/form/ModalForm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import AutocompleteInput from '@/components/AutocompleteInput.vue'
import MediaUploadInput from '@/components/modules/media/MediaUploadInput.vue'

import PriceRangesForm from './PriceRangesForm.vue'
import ShippingPointForm from './ShippingPoint.vue'
import ShippingPointsGrid from './ShippingPointsGrid.vue'

import { DEFAULT_ADDRESS_FORM } from '@/consts/addressConsts'
import CountriesSelect from '@/components/CountriesSelect.vue'

type ShippingMethodForm = ShippingMethodCreateDto & { logo?: CdnMedia | null }

export default defineComponent({
  name: 'ShippingMethodsForm',
  components: {
    AutocompleteInput,
    ModalForm,
    FlexInput,
    ValidationProvider,
    SwitchInput,
    PriceRangesForm,
    ShippingPointForm,
    ShippingPointsGrid,
    CountriesSelect,
    MediaUploadInput,
  },
  props: {
    value: {
      type: Object as PropType<ShippingMethodForm>,
      required: true,
    },
    countries: {
      type: Array as PropType<ShippingCountry[]>,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    isShippingPointModalOpen: false,
    isShippingPointEditMode: false,
    editedPoint: { ...DEFAULT_ADDRESS_FORM } as AddressDto,
    oldPointIndex: 0,
    oldPointName: '',
  }),
  computed: {
    form: {
      get(): ShippingMethodForm {
        return this.value
      },
      set(value: ShippingMethodForm) {
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
        this.$refs.priceRange.forEach((slot) => slot.validate())
      },
    },
    'form.payment_on_delivery'() {
      if (this.form.payment_on_delivery) this.form.payment_methods = []
    },
  },
  methods: {
    add() {
      this.editedPoint = { ...DEFAULT_ADDRESS_FORM }
      this.isShippingPointEditMode = false
      this.isShippingPointModalOpen = true
    },
    edit({ point, index }: { point: AddressDto; index: number }) {
      this.oldPointIndex = index
      this.editedPoint = { ...point }
      this.oldPointName = this.editedPoint.name
      this.isShippingPointEditMode = true
      this.isShippingPointModalOpen = true
    },
    addNewPoint(v: AddressDto) {
      this.form.shipping_points?.push(v)
      this.isShippingPointModalOpen = false
    },
    editPoint(v: AddressDto) {
      this.removePoint(this.oldPointIndex)
      this.addNewPoint(v)
    },
    removePoint(index: number) {
      this.form.shipping_points?.splice(index, 1)
    },
    changeMedia(media: CdnMedia | null) {
      this.form.logo = media ?? undefined
      this.form.logo_id = media?.id || null
    },
  },
})
</script>

<style lang="scss">
.shipping-methods-form {
  &__header {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media ($viewport-8) {
      grid-template-columns: 0.5fr 1fr;
    }
  }

  .switch-input {
    margin-top: 0;
  }

  label.title {
    margin: 0 6px;
  }

  .ant-switch {
    background-color: var(--background-color-600);
  }
  .ant-switch-checked {
    background-color: var(--black-color);
  }
}
</style>

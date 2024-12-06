<template>
  <div class="manufacturers">
    <div class="manufacturers__fields">
      <validated-input
        v-model="form.name"
        :disabled="disabled"
        rules="required"
        name="name"
        :label="$t('name')"
      />
      <validated-input
        v-model="form.email"
        :disabled="disabled"
        rules="required|email"
        name="email"
        :label="$t('email')"
      />
      <validated-input
        v-model="form.first_name"
        :disabled="disabled"
        name="first_name"
        :label="$t('firstName')"
      />
      <validated-input
        v-model="form.last_name"
        :disabled="disabled"
        name="last_name"
        :label="$t('lastName')"
      />
    </div>
    <hr />
    <div>
      <h2 class="manufacturers__title">{{ $t('relatedProducts') }}</h2>
      <autocomplete-input
        :key="form.product_ids?.length || 0"
        v-model="form.product_ids"
        :label="`${$t('products')}`"
        model-url="products"
        prop-mode="id"
        :disabled="disabled"
        :rules="{ required: form.product_ids && form.product_ids.length === 0 }"
        class="sale-configurator__autocomplete"
      >
        <template #option="product">
          {{ product.name }}&nbsp;<small>(/{{ product.slug }})</small>
        </template>
      </autocomplete-input>
    </div>
    <hr />
    <h2 class="manufacturers__title">{{ $t('manufactureAddress') }}</h2>
    <div class="manufacturers__address-fields">
      <address-form v-model="form.address" />
    </div>
  </div>
</template>
<i18n lang="json">
{
  "pl": {
    "name": "Nazwa",
    "email": "Email",
    "lastName": "Nazwisko",
    "firstName": "Imię",
    "products": "Produkty",
    "manufactureAddress": "Adres Producenta",
    "relatedProducts": "Produkty powiązane"
  },
  "en": {
    "name": "Name",
    "email": "Email",
    "lastName": "Last Name",
    "firstName": "First Name",
    "products": "Products",
    "manufactureAddress": "Manufacture address",
    "relatedProducts": "Related products"
  }
}
</i18n>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ManufacturerDto } from '@heseya/store-core'
import AutocompleteInput from '@/components/AutocompleteInput.vue'
import AddressForm from '@/components/modules/orders/AddressForm.vue'

export type ManufacturerForm = ManufacturerDto & { id?: string }

export default defineComponent({
  components: {
    AutocompleteInput,
    AddressForm,
  },
  props: {
    value: {
      type: Object as PropType<ManufacturerForm>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): ManufacturerDto {
        return this.value
      },
      set(v: ManufacturerDto) {
        this.$emit('input', v)
      },
    },
  },
  methods: {},
})
</script>
<style lang="scss" scoped>
.manufacturers {
  &__fields {
    display: grid;
    gap: 6px;
    grid-template-areas:
      'name email'
      'first_name last_name';
  }
  &__address-fields {
    display: grid;
    gap: 6px;
  }
  &__title {
    margin-right: 12px;
    font-size: 1.1em;
    font-weight: 500;
  }
}
</style>

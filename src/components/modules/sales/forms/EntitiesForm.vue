<template>
  <div class="order-value-form">
    <autocomplete-input
      v-if="type === DiscountConditionType.UserInRole"
      v-model="form.roles"
      :label="$t('form.roles')"
      model="roles"
      :disabled="disabled"
    />
    <autocomplete-input
      v-else-if="type === DiscountConditionType.UserIn"
      v-model="form.users"
      :label="$t('form.users')"
      model="users"
      :disabled="disabled"
    />
    <autocomplete-input
      v-else-if="type === DiscountConditionType.ProductIn"
      v-model="form.products"
      :label="$t('form.products')"
      model="products"
      :disabled="disabled"
    />
    <autocomplete-input
      v-else-if="type === DiscountConditionType.ProductInSet"
      v-model="form.product_sets"
      :label="$t('form.product_sets')"
      model="productSets"
      :disabled="disabled"
    />

    <div class="condition-form__row">
      <switch-input v-model="form.is_allow_list" :disabled="disabled">
        <template #title>
          {{ $t('form.is_allow_list') }}
          <info-tooltip>{{ $t('tooltips.is_allow_list') }}</info-tooltip>
        </template>
      </switch-input>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "form": {
      "roles": "User roles",
      "users": "Users",
      "products": "Products",
      "product_sets": "Product sets",
      "is_allow_list": "Is allow list"
    },
    "tooltips": {
      "is_allow_list": "If checked, the condition will be satisfied only if the object is included in the list; otherwise, the condition will be satisfied only if the object is NOT in the list"
    }
  },
  "pl": {
    "form": {
      "roles": "Role użytkowników",
      "users": "Użytkownicy",
      "products": "Produkty",
      "product_sets": "Kolekcje",
      "is_allow_list": "Tylko wartości z listy"
    },
    "tooltips": {
      "is_allow_list": "Jeżeli zaznaczone, warunek będzie spełniony tylko jeżeli obiekt jest podany w liście, w przeciwnym wypadku warunek będzie spełniony tylko jeżeli obiektu NIE będzie na liście"
    }
  }
}
</i18n>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from 'vue'

import { DiscountConditionType } from '@/interfaces/SaleCondition'
import { Role } from '@/interfaces/Role'
import { User } from '@/interfaces/User'
import { ProductSet } from '@/interfaces/ProductSet'
import { Product } from '@/interfaces/Product'

import SwitchInput from '@/components/form/SwitchInput.vue'
import AutocompleteInput from '@/components/AutocompleteInput.vue'

type EntitiesForm = {
  type: DiscountConditionType
  roles: Role[]
  users: User[]
  product_sets: ProductSet[]
  products: Product[]
  is_allow_list: boolean
}

export default Vue.extend({
  components: { SwitchInput, AutocompleteInput },
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<EntitiesForm>,
    type: { type: String, required: true } as Vue.PropOptions<DiscountConditionType>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    DiscountConditionType(): typeof DiscountConditionType {
      return DiscountConditionType
    },
    formId(): string {
      // ? Unofficial Vue api
      // @ts-ignore
      return this._uid
    },
    form: {
      get(): EntitiesForm {
        return this.value
      },
      set(v: EntitiesForm) {
        this.$emit('input', v)
      },
    },
  },
})
</script>

<template>
  <div class="order-value-form">
    <autocomplete-input
      v-if="type === DiscountConditionType.UserInRole"
      v-model="form.roles"
      :label="$t('form.roles')"
      model-url="roles"
      :disabled="disabled"
      :rules="{ required: form.is_allow_list }"
    />
    <autocomplete-input
      v-else-if="type === DiscountConditionType.UserIn"
      v-model="form.users"
      :label="$t('form.users')"
      model-url="users"
      :disabled="disabled"
      :rules="{ required: form.is_allow_list }"
    >
      <template #option="option">
        {{ option.name }}&nbsp;<small>({{ option.email }})</small>
      </template>
    </autocomplete-input>
    <autocomplete-input
      v-else-if="type === DiscountConditionType.ProductIn"
      v-model="form.products"
      :label="$t('form.products')"
      model-url="products"
      :disabled="disabled"
      :rules="{ required: form.is_allow_list }"
    >
      <template #option="option">
        {{ option.name }}&nbsp;<small>(/{{ option.slug }})</small>
      </template>
    </autocomplete-input>
    <autocomplete-input
      v-else-if="type === DiscountConditionType.ProductInSet"
      v-model="form.product_sets"
      :label="$t('form.product_sets')"
      model-url="product-sets"
      :disabled="disabled"
      :rules="{ required: form.is_allow_list }"
    >
      <template #option="option">
        {{ option.name }}&nbsp;<small>(/{{ option.slug }})</small>
      </template>
    </autocomplete-input>

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

<i18n lang="json">
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
import { defineComponent, PropOptions } from 'vue'
import { DiscountConditionType, Role, User, ProductSet, Product } from '@heseya/store-core'

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

export default defineComponent({
  components: { SwitchInput, AutocompleteInput },
  props: {
    value: { type: Object, required: true } as PropOptions<EntitiesForm>,
    type: { type: String, required: true } as PropOptions<DiscountConditionType>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    DiscountConditionType(): typeof DiscountConditionType {
      return DiscountConditionType
    },
    formId(): string {
      // @ts-ignore // ? Unofficial Vue api
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

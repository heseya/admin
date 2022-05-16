<template>
  <validation-provider v-slot="{ errors }">
    <app-select
      v-model="innerValue"
      :placeholder="$t('form.setsPlaceholder')"
      mode="multiple"
      name="sets"
      :label="$t('form.sets')"
      option-filter-prop="label"
      :disabled="disabled"
      allow-search
      @search="(v) => (query = v)"
    >
      <a-select-option v-for="set in productSets" :key="set.id" :label="set.name">
        <i v-if="!set.public" class="bx bx-lock"></i>
        {{ set.name }}&nbsp;<small>(/{{ set.slug }})</small>
      </a-select-option>
      <template #message-danger>{{ errors[0] }}</template>
    </app-select>
  </validation-provider>
</template>

<i18n>
{
  "pl": {
    "form": {
      "sets": "Kolekcje",
      "setsPlaceholder": "Wybierz kolekcje"
    }
  },
  "en": {
    "form": {
      "sets": "Sets",
      "setsPlaceholder": "Select sets"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import { ProductSet } from '@/interfaces/ProductSet'
import { UUID } from '@/interfaces/UUID'
import { Product } from '@/interfaces/Product'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: { ValidationProvider },

  props: {
    disabled: { type: Boolean, default: false },
    value: { type: Array, required: true } as Vue.PropOptions<UUID[]>, // TODO: change to full object?
    product: { type: Object, required: true } as Vue.PropOptions<Product>,
  },

  data: () => ({
    query: '',
  }),

  computed: {
    productSets(): ProductSet[] {
      // TODO: remove duplicates, include newly added sets
      return [...(this.product?.sets || []), ...this.$accessor.productSets.getData]
    },

    innerValue: {
      get(): UUID[] {
        return this.value
      },
      set(v: UUID[]) {
        this.$emit('input', v)
      },
    },
  },

  watch: {
    query() {
      // TODO: debounce
      this.fetchProductSets()
    },
  },

  methods: {
    async fetchProductSets() {
      try {
        await this.$accessor.productSets.fetch({ search: this.query })
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },
  },
})
</script>

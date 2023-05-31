<template>
  <validated-select
    v-model="innerValue"
    :placeholder="$t('form.setsPlaceholder')"
    mode="multiple"
    name="sets"
    :label="$t('form.sets')"
    option-filter-prop="label"
    :disabled="disabled"
    allow-search
    :loading="isLoading"
    @search="(v) => (query = v)"
  >
    <a-select-option v-for="set in productSets" :key="set.id" :label="set.name">
      <i v-if="!set.public" class="bx bx-lock"></i>
      {{ set.name }}&nbsp;<small>(/{{ set.slug }})</small>
    </a-select-option>
  </validated-select>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "sets": "Kolekcje",
      "setsPlaceholder": "Wybierz kolekcje produktu"
    }
  },
  "en": {
    "form": {
      "sets": "Sets",
      "setsPlaceholder": "Select product sets"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import debounce from 'lodash/debounce'
import uniqBy from 'lodash/uniqBy'
import { ProductSet, Product } from '@heseya/store-core'

import { UUID } from '@/interfaces/UUID'
import { formatApiNotificationError } from '@/utils/errors'

export default defineComponent({
  props: {
    disabled: { type: Boolean, default: false },
    value: { type: Array as PropType<UUID[]>, required: true },
    product: { type: Object as PropType<Product>, required: true },
  },

  data: () => ({
    isLoading: false,
    query: '',
  }),

  computed: {
    productSets(): ProductSet[] {
      return uniqBy([...(this.product?.sets || []), ...this.$accessor.productSets.getData], 'id')
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
    query: debounce(function (this: any) {
      this.fetchProductSets()
    }, 200),
  },

  created() {
    this.fetchProductSets()
  },

  methods: {
    async fetchProductSets() {
      this.isLoading = true
      try {
        await this.$accessor.productSets.fetch({ search: this.query, tree: 0, root: undefined })
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.isLoading = false
    },
  },
})
</script>

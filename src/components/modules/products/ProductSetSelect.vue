<template>
  <validated-select
    v-model="innerValue"
    :placeholder="$t('form.setsPlaceholder').toString()"
    mode="multiple"
    name="sets"
    class="set-select"
    :label="$t('form.sets').toString()"
    option-filter-prop="label"
    :disabled="disabled"
    allow-search
    :loading="isLoading"
    @search="handleSearch"
  >
    <a-select-option
      v-for="set in productSets"
      :key="set.id"
      :label="set.name"
      :title="`URL: /${set.slug}`"
    >
      <div class="set-select__option">
        <i v-if="!set.public" class="bx bx-lock"></i>
        {{ set.name }}&nbsp;
        <small class="set-select__slug"> (/{{ set.slug }}) </small>
      </div>
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

    handleSearch(query: string) {
      this.query = query
    },
  },
})
</script>

<style lang="scss" scoped>
.set-select {
  &__option {
    display: flex;
    align-items: center;
  }

  &__slug {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;

    @media ($max-viewport-4) {
      display: none;
    }
  }
}
</style>

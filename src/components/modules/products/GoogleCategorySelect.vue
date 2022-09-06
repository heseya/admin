<template>
  <app-select
    v-model="selectedValue"
    option-filter-prop="label"
    filter-option
    show-search
    allow-clear
    :loading="isLoading"
    @search="(v) => (searchQuery = v)"
  >
    <template #label>
      {{ $t('name') }}
      <info-tooltip>
        <!-- eslint-disable-next-line vue/no-bare-strings-in-template -->
        <a href="https://support.google.com/merchants/answer/6324436" target="_blank">
          https://support.google.com/merchants/answer/6324436
        </a>
      </info-tooltip>
    </template>

    <a-select-option v-for="{ id, name } in options" :key="id" :value="id" :label="name">
      {{ name }}
    </a-select-option>
  </app-select>
</template>

<i18n lang="json">
{
  "en": {
    "name": "Google Product Category"
  },
  "pl": {
    "name": "Kategoria produktu Google"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import InfoTooltip from '@/components/layout/InfoTooltip.vue'

import { sdk } from '@/api'

interface GoogleCategoryOption {
  id: number
  name: string
}

export default Vue.extend({
  components: { InfoTooltip },
  props: {
    value: {
      type: Number,
      default: null,
    },
  },

  data: () => ({
    searchQuery: '',
    isLoading: false,
    allOptions: [] as GoogleCategoryOption[],
  }),

  computed: {
    selectedValue: {
      get(): number | null {
        return this.value || null
      },
      set(v: number | null) {
        this.$emit('input', v)
      },
    },

    options(): GoogleCategoryOption[] {
      const selected = this.allOptions.find((o) => o.id === this.selectedValue)
      const searched = this.allOptions
        .filter(({ name }) => name.toLowerCase().includes(this.searchQuery.toLowerCase()))
        .filter((_, i) => i < 32) // limit to 32 results only

      // Add selected category if not included already
      return selected && !searched.includes(selected) ? [selected, ...searched] : searched
    },
  },

  watch: {
    'this.$i18n.locale'() {
      this.fetchOptions()
    },
  },

  created() {
    this.fetchOptions()
  },

  methods: {
    async fetchOptions() {
      this.isLoading = true
      try {
        const lang = this.$i18n.locale === 'pl' ? 'pl-PL' : 'en-US'
        this.allOptions = await sdk.Products.getGoogleCategories(lang)
      } catch (e: any) {
        this.$toast.error(`Google Categories: ${e.message}`)
      }
      this.isLoading = false
    },
  },
})
</script>

<template>
  <div>
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      :label="$t('common.search')"
      allow-clear
      @input="debouncedSearch"
    />

    <app-select
      v-model="local.consent_id"
      :label="$t('consents')"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option v-for="consent in userConsents" :key="consent.id" :label="consent.name">
        {{ consent.name }}
      </a-select-option>
    </app-select>
  </div>
</template>

<i18n>
{
  "pl": {
    "consents": "Zaakceptowane zgody"
  },
  "en": {
    "consents": "Accepted consents"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'

import { ALL_FILTER_VALUE } from '@/consts/filters'

export const EMPTY_USER_FILTERS = {
  search: '',
  consent_id: ALL_FILTER_VALUE,
}

type UserFilters = typeof EMPTY_USER_FILTERS

export default Vue.extend({
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_USER_FILTERS }),
    } as Vue.PropOptions<UserFilters>,
  },
  data: () => ({
    local: { ...cloneDeep(EMPTY_USER_FILTERS) },
  }),
  computed: {
    userConsents() {
      return this.$accessor.consents.getData
    },
  },
  watch: {
    filters(filters: UserFilters) {
      this.local = { ...this.local, ...filters }
    },
  },
  async created() {
    this.$accessor.startLoading()
    await this.$accessor.consents.fetch()
    this.$accessor.stopLoading()
  },
  mounted() {
    this.local = { ...this.local, ...this.filters }
  },
  methods: {
    makeSearch() {
      this.$emit('search', {
        ...this.filters,
        ...this.local,
      })
    },

    debouncedSearch: debounce(function (this: any) {
      this.$nextTick(() => {
        this.makeSearch()
      })
    }, 300),
  },
})
</script>

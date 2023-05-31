<template>
  <div>
    <app-input
      v-model="local.search"
      type="search"
      :label="$t('common.search')"
      allow-clear
      @input="debouncedSearch"
    />

    <autocomplete-input
      v-model="local.roles"
      prop-mode="id"
      class="span-2"
      model-url="roles"
      :label="$t('roles')"
      @input="debouncedSearch"
    />

    <app-select
      v-model="local.consent_id"
      :all-text="$t('noFilter')"
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

<i18n lang="json">
{
  "pl": {
    "consents": "Zaakceptowane zgody",
    "noFilter": "Brak filtrowania",
    "roles": "Role użytkownika"
  },
  "en": {
    "consents": "Accepted consents",
    "noFilter": "No filter",
    "roles": "User roles"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'
import { debounce } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'

import { ALL_FILTER_VALUE } from '@/consts/filters'
import { UUID } from '@/interfaces/UUID'
import AutocompleteInput from '@/components/AutocompleteInput.vue'

export const EMPTY_USER_FILTERS = {
  search: '',
  roles: [] as UUID[],
  consent_id: ALL_FILTER_VALUE,
}

type UserFilters = typeof EMPTY_USER_FILTERS

export default defineComponent({
  components: { AutocompleteInput },
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_USER_FILTERS }),
    } as PropOptions<UserFilters>,
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

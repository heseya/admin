<template>
  <app-select v-model="$root.$i18n.locale" :label="$t('name')">
    <a-select-option v-for="{ id, name } in options" :key="id" :value="id" :label="name">
      {{ name }}
    </a-select-option>
  </app-select>
</template>

<i18n>
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

interface GoogleCategoryOption {
  id: number
  name: string
}

export default Vue.extend({
  props: {
    value: {
      type: Number,
      default: null,
    },
  },

  data: () => ({
    options: [] as GoogleCategoryOption[],
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
  },

  created() {
    this.fetchOptions()
  },

  methods: {
    fetchOptions() {
      // TODO: fetch from api
    },
  },
})
</script>

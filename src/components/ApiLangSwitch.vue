<template>
  <div class="api-lang-switch">
    <app-select v-model="apiLanguage" :label="$t('name')">
      <a-select-option
        v-for="lang in languages"
        :key="lang.id"
        :value="lang.iso"
        :label="lang.name"
      >
        {{ lang.name }}
      </a-select-option>
    </app-select>
  </div>
</template>

<i18n>
{
  "en": {
    "name": "API content language"
  },
  "pl": {
    "name": "Język treści z API"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    languages() {
      return this.$accessor.languages.data.filter((lang) => !lang.hidden)
    },
    apiLanguage: {
      get(): string | undefined {
        return this.$accessor.config.apiLanguage || undefined
      },
      set(iso: string) {
        this.$accessor.config.SET_API_LANGUAGE(iso)
      },
    },
  },
  watch: {
    apiLanguage(locale: string) {
      // TODO: API LANG CHANGE SIDEEFFECTS
      console.log('🚀 ~ file: ApiLangSwitch.vue ~ line 48 ~ apiLanguage changed', locale)
    },
  },
})
</script>

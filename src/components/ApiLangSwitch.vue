<template>
  <div class="api-lang-switch">
    <a-tooltip>
      <select v-model="apiLanguage" class="api-lang-switch__select" :label="$t('name')">
        <option v-for="lang in languages" :key="lang.id" :value="lang.iso">
          {{ lang.name }}
        </option>
      </select>

      <template #title> {{ $t('name') }}</template>
    </a-tooltip>
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
})
</script>

<style lang="scss" scoped>
.api-lang-switch {
  &__select {
    all: unset;
    padding: 4px 16px;
    padding-right: 32px;
    border-radius: 24px;
    background-color: #fff;
    border: solid 1px $background-color-600;
    background-image: url("data:image/svg+xml;utf8,<svg fill='%23979ea0' height='20' viewBox='0 0 16 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z' /><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position-x: 90%;
    background-position-y: 4px;
  }
}
</style>

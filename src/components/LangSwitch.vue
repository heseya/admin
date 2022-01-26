<template>
  <div class="lang-switch">
    <small> {{ $t('name') }} </small>
    <select v-model="$root.$i18n.locale">
      <option v-for="lang in $i18n.availableLocales" :key="lang" :value="lang">
        {{ $t(lang) }}
      </option>
    </select>
  </div>
</template>

<i18n>
{
  "en": {
    "name": "Interface language",
    "pl": "Polish",
    "en": "English"
  },
  "pl": {
    "name": "Język interfejsu",
    "pl": "Polski",
    "en": "Angielski"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { LOCALE_STORAGE_KEY } from '@/consts/i18n'

export default Vue.extend({
  watch: {
    '$root.$i18n.locale'(locale: string) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    },
  },
})
</script>

<style lang="scss" scoped>
.lang-switch {
}
</style>

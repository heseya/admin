<template>
  <div class="lang-switch">
    <app-select v-model="$root.$i18n.locale" :label="$t('name').toString()">
      <a-select-option
        v-for="lang in $i18n.availableLocales"
        :key="lang"
        :value="lang"
        :label="$t(lang).toString()"
      >
        {{ $t(lang) }}
      </a-select-option>
    </app-select>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "name": "Admin dashboard interface language",
    "pl": "Polish",
    "en": "English"
  },
  "pl": {
    "name": "Język interfejsu panelu administracyjnego",
    "pl": "Polski",
    "en": "Angielski"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { localeChanged } from 'vee-validate'
import { LOCALE_STORAGE_KEY } from '@/consts/i18n'

export default defineComponent({
  watch: {
    '$root.$i18n.locale'(locale: string) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
      this.$i18n.locale = locale
      localeChanged()
    },
  },
})
</script>

<style lang="scss" scoped>
.lang-switch {
}
</style>

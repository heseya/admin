<template>
  <div class="api-lang-switch">
    <a-tooltip>
      <app-select v-model="apiLanguage" class="api-lang-switch__select">
        <a-select-option
          v-for="lang in languages"
          :key="lang.id"
          :value="lang.iso"
          :label="lang.name"
        >
          <span class="api-lang-switch__option">
            <img
              :src="`https://flagcdn.com/16x12/${getFlagName(lang.iso)}.png`"
              role="presentation"
              class="api-lang-switch__icon"
            />
            {{ $t('lang') }}: {{ lang.name }}
          </span>
        </a-select-option>
      </app-select>

      <template #title> {{ $t('name') }}</template>
    </a-tooltip>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "lang": "Language",
    "name": "API content language"
  },
  "pl": {
    "lang": "Język",
    "name": "Język treści z API"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
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

  methods: {
    getFlagName(iso: string) {
      const firstIsoPart = iso.split('-')[0]
      if (firstIsoPart === 'en' || firstIsoPart === 'eng') return 'us'
      return firstIsoPart
    },
  },
})
</script>

<style lang="scss">
.api-lang-switch {
  position: relative;
  padding: 0 4px;

  &__option {
    text-transform: uppercase;
    font-size: 0.7rem !important;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
  }

  &__icon {
    display: block;
    width: 16px;
    height: 16px;
    object-fit: contain;
    object-position: center;
    margin-right: 8px;
  }
}
</style>

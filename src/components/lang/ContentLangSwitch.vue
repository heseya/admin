<template>
  <div class="content-lang-switch-wrapper">
    <div class="content-lang-switch">
      <span class="content-lang-switch__title">
        {{ $t('title') }}
      </span>

      <button
        v-for="lang in languages"
        :key="lang.id"
        class="content-lang-switch__button"
        :class="{ 'content-lang-switch__button--active': value === lang.id }"
        :value="lang.iso"
        :label="lang.name"
        @click="update(lang.id)"
      >
        <img
          :src="`https://flagcdn.com/16x12/${getFlagName(lang.iso)}.png`"
          role="presentation"
          class="content-lang-switch__icon"
        />
      </button>

      <InfoTooltip class="content-lang-switch__tooltip" :text="$t('tooltipText').toString()" />
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "title": "You are managing version",
    "tooltipText": "You can switch here the language of the content you are editing, unsaved changes will not be lost when switching the language"
  },
  "pl": {
    "title": "Zarządzasz wersją",
    "tooltipText": "Możesz przełączyć tutaj język treści w jakiej edytujesz, niezapisane zmiany nie zostaną utracone przy przełączaniu języka"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import InfoTooltip from '../layout/InfoTooltip.vue'

export default defineComponent({
  components: { InfoTooltip },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  emits: ['input'],
  computed: {
    languages() {
      return this.$accessor.languages.data.filter((lang) => !lang.hidden)
    },
  },
  methods: {
    getFlagName(iso: string) {
      const firstIsoPart = iso.split('-')[0]
      if (firstIsoPart === 'en' || firstIsoPart === 'eng') return 'us'
      return firstIsoPart
    },
    update(lang: string) {
      this.$emit('input', lang)
    },
  },
})
</script>

<style lang="scss">
.content-lang-switch-wrapper {
  position: absolute;
  left: 100%;
  top: 0;
  height: 100%;
}

.content-lang-switch {
  position: sticky;
  // left: calc(100% + 16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  background-color: $background-color-500;
  padding: 8px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;

  &__title {
    direction: rtl;
    writing-mode: vertical-rl;
    color: $gray-color-600;
    font-size: 11px;
    letter-spacing: 1px;
    transform: rotate(180deg);
  }

  &__icon {
    display: block;
    width: 16px;
    height: 16px;
    object-fit: contain;
    object-position: center;
    margin-right: 8px;
  }

  &__button {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: solid 1px var(--background-color-500);
    background-color: var(--background-color-500);
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      border-color: var(--primary-color-300);
    }

    &--active {
      background-color: #fff;
      border-color: var(--primary-color-500);
    }
  }

  &__tooltip {
    font-size: 1.1em !important;
  }
}
</style>

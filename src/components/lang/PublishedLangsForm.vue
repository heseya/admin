<template>
  <div class="published-langs-form" :class="{ 'published-langs-form--slim': slim }">
    <h2 class="published-langs-form__title">{{ $t('title') }}</h2>

    <span class="published-langs-form__description">{{ $t('description') }}</span>

    <div class="published-langs-form__content">
      <div v-for="lang in languages" :key="lang.id" class="lang-switch">
        <div class="lang-switch__name">
          <LangFlag :lang="lang.iso" class="lang-switch__icon" />
          {{ lang.name }}

          <InfoTooltip
            v-if="lang.default"
            class="lang-switch__tooltip"
            :text="$t('defaultLangTooltip').toString()"
          />
        </div>
        <SwitchInput
          :id="lang.id"
          :value="publishedMap[lang.id]"
          :name="lang.iso"
          :disabled="lang.default"
          @input="setPublished(lang.id, $event)"
        />
      </div>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Published languages",
    "description": "This page is published only in the following languages:",
    "defaultLangTooltip": "Default language must be always published"
  },
  "pl": {
    "title": "Aktywność w wersjach językowych",
    "description": "Dana strona jest opublikowana tylko w następujących wersjach językowych:",
    "defaultLangTooltip": "Domyślny język musi być zawsze opublikowany"
  }
}
</i18n>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import SwitchInput from '../form/SwitchInput.vue'
import InfoTooltip from '../layout/InfoTooltip.vue'
import LangFlag from './LangFlag.vue'

export default defineComponent({
  components: { SwitchInput, InfoTooltip, LangFlag },
  props: {
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    slim: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['input'],

  computed: {
    languages() {
      return this.$accessor.languages.data.filter((lang) => !lang.hidden)
    },

    publishedMap(): Record<string, boolean> {
      return this.languages.reduce((acc, lang) => {
        acc[lang.id] = this.value.includes(lang.id)
        return acc
      }, {} as Record<string, boolean>)
    },
  },

  watch: {
    '$accessor.languages.defaultLanguage': {
      handler(defaultLang) {
        // Default language must be always published
        if (defaultLang && !this.publishedMap[defaultLang.id])
          this.setPublished(defaultLang?.id, true)
      },
      immediate: true,
    },

    value: {
      handler() {
        if (this.value.some((langId) => !this.languages.find((lang) => lang.id === langId)))
          this.$emit(
            'input',
            this.value.filter((langId) => this.languages.find((lang) => lang.id === langId)),
          )

        const defaultLang = this.$accessor.languages.defaultLanguage
        // Default language must be always published
        if (defaultLang && !this.publishedMap[defaultLang.id])
          this.setPublished(defaultLang?.id, true)
      },
      immediate: true,
    },
  },

  methods: {
    setPublished(langId: string, value: boolean) {
      const publishedMap = {
        ...this.publishedMap,
        [langId]: value,
      }
      this.$emit(
        'input',
        Object.keys(publishedMap).filter((key) => publishedMap[key]),
      )
    },
  },
})
</script>

<style lang="scss">
.published-langs-form {
  &__title {
    font-size: 1.1em;
    line-height: 1em;
    margin-bottom: 0;
  }

  &__description {
    color: $gray-color-500;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    @media ($viewport-4) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media ($viewport-7) {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  &--slim &__title {
    font-size: 1em;
  }
  &--slim &__description {
    font-size: 0.8em;
  }
  &--slim .lang-switch {
    flex-direction: row;

    &__name {
      margin-bottom: 0;
      margin-right: 8px;
    }
  }
}

.lang-switch {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;

  &__name {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  &__icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
    display: block;
    margin-right: 8px;
  }

  &__tooltip {
    margin-left: 4px;
  }
}
</style>

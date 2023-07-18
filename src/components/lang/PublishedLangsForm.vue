<template>
  <div class="published-langs-form">
    <h2 class="published-langs-form__title">{{ $t('title') }}</h2>

    <span class="published-langs-form__description">{{ $t('description') }}</span>

    <div class="published-langs-form__content">
      <div v-for="lang in languages" :key="lang.id" class="lang-switch">
        <div class="lang-switch__name">
          <img
            :src="`https://flagcdn.com/16x12/${getFlagName(lang.iso)}.png`"
            role="presentation"
            class="lang-switch__icon"
          />
          {{ lang.name }}

          <InfoTooltip
            v-if="lang.default"
            class="lang-switch__tooltip"
            :text="$t('defaultLangTooltip').toString()"
          />
        </div>
        <SwitchInput
          :id="lang.iso"
          :value="publishedMap[lang.iso]"
          :name="lang.iso"
          :disabled="lang.default"
          @input="setPublished(lang.iso, $event)"
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

export default defineComponent({
  components: { SwitchInput, InfoTooltip },
  props: {
    value: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ['input'],
  computed: {
    languages() {
      return this.$accessor.languages.data.filter((lang) => !lang.hidden)
    },

    publishedMap(): Record<string, boolean> {
      return this.languages.reduce((acc, lang) => {
        acc[lang.iso] = this.value.includes(lang.iso)
        return acc
      }, {} as Record<string, boolean>)
    },
  },

  watch: {
    '$accessor.languages.default': {
      handler(defaultLang) {
        // Default language must be always published
        this.setPublished(defaultLang?.iso, true)
      },
      immediate: true,
    },
  },

  methods: {
    getFlagName(iso: string) {
      const firstIsoPart = iso.split('-')[0]
      if (firstIsoPart === 'en' || firstIsoPart === 'eng') return 'us'
      return firstIsoPart
    },
    setPublished(langIso: string, value: boolean) {
      const publishedMap = {
        ...this.publishedMap,
        [langIso]: value,
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

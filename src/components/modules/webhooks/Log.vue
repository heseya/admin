<template>
  <div class="log">
    <div :class="singleLogClass">
      {{ data.status_code || $t('noStatusInfo') }}
    </div>

    <div class="log__data">
      <span class="log__data-key log__data-key--id">id:</span>
      <span class="log__data-value">
        {{ data.id }}
      </span>

      <span class="log__data-key">url:</span>

      <div class="log__data-value">
        <a :href="data.url" class="log__data-link">{{ data.url }}</a>
      </div>

      <span class="log__data-key">{{ $t('triggered_at') }}:</span>
      <span class="log__data-value">
        {{ triggerTime }}
        <span class="log__data-value-relative">({{ relativeTime }})</span>
      </span>

      <span class="log__data-key">{{ $t('response') }}:</span>
      <a-collapse :bordered="false">
        <template #expandIcon="{ isActive }">
          <div>
            <i :class="`bx ${isActive ? 'bx-chevron-up' : 'bx-chevron-down'}`"></i>
          </div>
        </template>

        <a-collapse-panel class="log__data-value">
          <template #header>
            <span v-if="data.response">{{ $t('expand') }}</span>
            <span v-else>-</span>
          </template>
        </a-collapse-panel>

        <pre v-if="data.response">{{ logReponse }}</pre>
      </a-collapse>

      <span class="log__data-key">{{ $t('payload') }}:</span>
      <a-collapse :bordered="false">
        <template #expandIcon="{ isActive }">
          <div>
            <i :class="`bx ${isActive ? 'bx-chevron-up' : 'bx-chevron-down'}`"></i>
          </div>
        </template>

        <a-collapse-panel class="log__data-value">
          <template #header>
            <span v-if="data.payload">{{ $t('expand') }}</span>
            <span v-else>-</span>
          </template>
        </a-collapse-panel>

        <pre v-if="data.payload">{{ payloadResponse }}</pre>
      </a-collapse>
    </div>
  </div>
</template>

<i18n>
{
  "pl": {
    "triggered_at": "wywołany",
    "response": "odpowiedź",
    "payload": "dane",
    "expand": "Rozwiń aby zobaczyć",
    "noStatusInfo": "Brak informacji o statusie"
  },
  "en": {
    "triggered_at": "triggered at",
    "response": "response",
    "payload": "payload",
    "expand": "Expand to see more",
    "noStatusInfo": "No status information"
  }
}
</i18n>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

import { ComputedClassName } from '@/interfaces/computedClassName'
import { WebhookEventLog } from '@heseya/store-core'
import { getRelativeDate } from '@/utils/utils'

export default Vue.extend({
  props: {
    data: { type: Object, required: true } as PropOptions<WebhookEventLog>,
  },

  computed: {
    singleLogClass(): ComputedClassName {
      return [
        `log__status`,
        { 'log__status--100': String(this.data.status_code).startsWith('1') },
        { 'log__status--200': String(this.data.status_code).startsWith('2') },
        { 'log__status--300': String(this.data.status_code).startsWith('3') },
        { 'log__status--400': String(this.data.status_code).startsWith('4') },
        { 'log__status--500': String(this.data.status_code).startsWith('5') },
        { 'log__status--no-info': !this.data.status_code },
      ]
    },
    relativeTime(): string {
      return getRelativeDate(this.data.triggered_at, this.$i18n.locale)
    },
    triggerTime(): string {
      return new Date(this.data.triggered_at).toLocaleString(this.$i18n.locale)
    },
    logResponse(): string {
      return JSON.stringify(this.data.response, null, 2)
    },
    payloadResponse(): string {
      return JSON.stringify(this.data.payload, null, 2)
    },
  },
})
</script>

<style scoped lang="scss">
.log {
  display: grid;
  column-gap: 1rem;

  grid-auto-flow: row;
  justify-items: center;
  row-gap: 1rem;

  @media ($viewport-4) {
    grid-template-columns: 60px 1fr;
    column-gap: 24px;
  }

  &:first-child {
    padding-bottom: 1rem;
  }

  &:not(:first-child) {
    margin-top: 1rem;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e8e8e8;
  }

  &__status {
    width: 100%;
    height: 40px;
    display: grid;
    place-items: center;
    font-weight: 600;
    border-radius: 8px;

    @media ($viewport-4) {
      height: 60px;
      width: 60px;
      border-radius: 50%;
    }

    &--100 {
      background-color: #4fc3f7;
    }

    &--200 {
      background-color: #81c784;
    }

    &--300 {
      background-color: #9575cd;
      color: $primary-color-100;
    }

    &--400 {
      background-color: #fff176;
    }

    &--500 {
      background-color: #e57373;
      color: $primary-color-100;
    }

    &--no-info {
      background-color: transparent;
      border: 3px dotted lightslategray;
      color: lightslategray;
      font-size: 8px;
      text-align: center;
    }
  }

  &__data {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 8px;
    align-items: center;
    width: 100%;

    @media ($viewport-4) {
      column-gap: 16px;
    }
  }

  &__single-data {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 8px;

    &--unflexy {
      display: block;
    }
  }

  &__data-value {
    display: block;
    color: $font-color;
    background-color: rgba(0, 100, 220, 0.05);
    border-radius: 8px;
    padding: 6px 8px;

    &[role='tablist'] {
      border-radius: 8px !important;
    }

    &::v-deep {
      [role='button'] {
        padding: 0 !important;
      }

      .ant-collapse-arrow {
        right: 0px !important;
      }
    }
  }

  &__data-value-relative {
    color: $gray-color-600;
  }

  &__data-link {
    word-break: break-all;
  }
}
</style>

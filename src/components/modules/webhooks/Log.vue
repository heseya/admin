<template>
  <div class="log">
    <div :class="singleLogClass">
      {{ data.status_code || $t('noStatusInfo') }}
    </div>

    <div class="log__data">
      <span class="log__data-key log__data-key--id">{{ $t('event') }}:</span>
      <div class="log__data-value">
        <code>{{ data.event }}</code>

        <a-tooltip>
          <template #title>
            {{ triggerTime }}
          </template>
          <span class="log__data-value-relative">({{ relativeTime }})</span>
        </a-tooltip>
      </div>

      <!-- eslint-disable-next-line vue/no-bare-strings-in-template -->
      <span class="log__data-key">url:</span>
      <div class="log__data-value">
        <a :href="data.url" target="_blank" class="log__data-link">{{ data.url }}</a>
      </div>

      <span class="log__data-key">{{ $t('payload') }}:</span>
      <LayoutAccordion v-if="data.payload" :title="$t('expand')">
        <vue-json-pretty v-if="data.payload" :path="'res'" :data="JSON.parse(payloadResponse)" />
      </LayoutAccordion>
      <span v-else class="log__data-value"> - </span>

      <span class="log__data-key">{{ $t('response') }}:</span>
      <LayoutAccordion v-if="data.payload" :title="$t('expand')">
        <vue-json-pretty v-if="data.response" :path="'res'" :data="JSON.parse(logResponse)" />
      </LayoutAccordion>
      <span v-else class="log__data-value"> - </span>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "event": "Wydarzenie",
    "response": "Odpowiedź",
    "payload": "Ładunek",
    "expand": "Rozwiń aby zobaczyć",
    "noStatusInfo": "Brak informacji o statusie"
  },
  "en": {
    "event": "Event",
    "response": "Response",
    "payload": "Payload",
    "expand": "Expand to see more",
    "noStatusInfo": "No status information"
  }
}
</i18n>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
// @ts-ignore
import VueJsonPretty from 'vue-json-pretty'
import { WebhookEventLog } from '@heseya/store-core'

import LayoutAccordion from '@/components/layout/Accordion.vue'

import { ComputedClassName } from '@/interfaces/computedClassName'
import { getRelativeDate } from '@/utils/utils'
import 'vue-json-pretty/lib/styles.css'

export default Vue.extend({
  components: {
    VueJsonPretty,
    LayoutAccordion,
  },

  props: {
    data: { type: Object, required: true } as PropOptions<WebhookEventLog>,
  },

  computed: {
    singleLogClass(): ComputedClassName {
      return [
        `log__status`,
        `log__status--${String(this.data.status_code).charAt(0)}00`,
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
  padding-bottom: 1rem;

  @media ($viewport-4) {
    grid-template-columns: 60px 1fr;
    column-gap: 24px;
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
      background-color: var(--blue-color-400);
    }

    &--200 {
      background-color: var(--green-color-400);
    }

    &--300 {
      background-color: var(--purple-color-400);
      color: var(--primary-color-100);
    }

    &--400 {
      background-color: var(--yellow-color-400);
    }

    &--500 {
      background-color: var(--red-color-500);
      color: var(--primary-color-100);
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

    pre {
      margin-bottom: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: auto;
    }

    :deep(.ant-collapse) {
      overflow: hidden;
      width: 100%;
    }

    :deep(.ant-collapse-content-box) {
      padding: 4px;
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
    color: var(--font-color);
    background-color: rgba(0, 100, 220, 0.05);
    border-radius: 8px;
    padding: 6px 8px;

    &[role='tablist'] {
      border-radius: 8px !important;
    }

    &:deep([role='button']) {
      padding: 0 !important;
    }

    &:deep(.ant-collapse-arrow) {
      right: 0px !important;
    }
  }

  &__data-value-relative {
    color: var(--gray-color-600);
  }

  &__data-link {
    word-break: break-all;
  }
}
</style>

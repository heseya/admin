<template>
  <div class="single-webhook">
    <div :class="singleWebhookClass">
      {{ event.status_code || 'Brak informacji o statusie' }}
    </div>

    <div class="single-webhook__data">
      <span class="single-webhook__data-key single-webhook__data-key--id">id:</span>
      <span class="single-webhook__data-value">
        {{ event.id }}
      </span>

      <span class="single-webhook__data-key">url:</span>

      <div class="single-webhook__data-value">
        <a :href="event.url" class="single-webhook__data-link">{{ event.url }}</a>
      </div>

      <span class="single-webhook__data-key">{{ $t('triggered_at') }}:</span>
      <span class="single-webhook__data-value">
        {{ new Date(event.triggered_at).toLocaleString('pl-PL') }}
        <span class="single-webhook__data-value-relative">({{ relativeTime }})</span>
      </span>

      <span class="single-webhook__data-key">{{ $t('response') }}:</span>
      <span class="single-webhook__data-value">
        {{ event.response || '-' }}
      </span>

      <span class="single-webhook__data-key">{{ $t('payload') }}:</span>
      <a-collapse :bordered="false">
        <template #expandIcon="{ isActive }">
          <div>
            <i :class="`bx ${isActive ? 'bx-chevron-up' : 'bx-chevron-down'}`"></i>
          </div>
        </template>

        <a-collapse-panel class="single-webhook__data-value">
          <template #header>
            <span v-if="event.payload">{{ $t('expand') }}</span>
            <span v-else>-</span>
          </template>
        </a-collapse-panel>

        <pre v-if="event.payload">{{ JSON.stringify(event.payload, null, 2) }}</pre>
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
    "expand": "Rozwiń aby zobaczyć"
  },
  "en": {
    "triggered_at": "triggered at",
    "response": "response",
    "payload": "payload",
    "expand": "Expand to see more"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { calculateRelativeTime } from '@/utils/calculateRelativeTime'
import { ComputedClassNameType } from '@/utils/computedClassName'

export default Vue.extend({
  props: {
    event: { type: Object, required: true },
  },

  computed: {
    singleWebhookClass(): ComputedClassNameType {
      return [
        `single-webhook__status`,
        { 'single-webhook__status--100': String(this.event.status_code).startsWith('1') },
        { 'single-webhook__status--200': String(this.event.status_code).startsWith('2') },
        { 'single-webhook__status--300': String(this.event.status_code).startsWith('3') },
        { 'single-webhook__status--400': String(this.event.status_code).startsWith('4') },
        { 'single-webhook__status--500': String(this.event.status_code).startsWith('5') },
        { 'single-webhook__status--no-info': !this.event.status_code },
      ]
    },
    relativeTime(): string {
      return calculateRelativeTime(this.event.triggered_at)
    },
  },
})
</script>

<style scoped lang="scss">
.single-webhook {
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

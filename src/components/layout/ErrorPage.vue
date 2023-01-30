<template>
  <div class="error-page">
    <card class="error-page__content">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <app-button v-if="!hideReturn" to="/"> {{ $t('returnBtn') }} </app-button>
    </card>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "returnBtn": "Wróć na stronę główną"
  },
  "en": {
    "returnBtn": "Return to main page"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Card from '@/components/layout/Card.vue'

export default Vue.extend({
  components: {
    Card,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    hideReturn: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss" scoped>
.error-page {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  &__content {
    width: 100%;
    max-width: 600px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      font-size: 6em;
      font-weight: 700;
      margin: 0;
    }

    p {
      font-style: italic;
    }
  }
}
</style>

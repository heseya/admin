<template>
  <div class="error-page">
    <card class="error-page__content">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <vs-button v-if="!hideReturn" dark to="/">Wróć na stronę główną</vs-button>
    </card>
  </div>
</template>

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

  &__content {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      font-size: 6em;
      font-family: $font-sec;
      margin: 0;
    }

    p {
      font-style: italic;
    }
  }
}
</style>

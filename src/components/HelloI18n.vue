<template>
  <div>
    <p>Locale: {{ $i18n.locale }}</p>
    <p>{{ $t('hello') }}</p>
    <p>
      {{ $t('message') }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HelloI18n',
})
</script>

<i18n>
{
  "en": {
    "hello": "Hello i18n in SFC!"
  },
  "pl": {
    "hello": "Siema i18n w SFC!"
  }
}
</i18n>

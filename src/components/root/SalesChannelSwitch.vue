<template>
  <div class="channel-switch">
    <app-select v-model="selectedChannel" class="channel-switch__select">
      <a-select-option
        v-for="channel in salesChannels"
        :key="channel.id"
        :value="channel.id"
        :label="channel.name"
      >
        <span class="channel-switch__option"> {{ $t('name') }}: {{ channel.name }} </span>
      </a-select-option>
    </app-select>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "name": "Channel"
  },
  "pl": {
    "name": "Kanał"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { SalesChannel } from '@heseya/store-core'

export default defineComponent({
  computed: {
    salesChannels(): SalesChannel[] {
      return this.$accessor.salesChannels.data
    },
    selectedChannel: {
      get(): string | undefined {
        return this.$accessor.config.salesChannel?.id
      },
      set(channelId: string) {
        this.$accessor.config.changeSalesChannel(this.salesChannels.find((s) => s.id === channelId))
      },
    },
  },
})
</script>

<style lang="scss">
.channel-switch {
  position: relative;
  padding: 0 4px;

  &__option {
    text-transform: uppercase;
    font-size: 0.7rem !important;
    letter-spacing: 1px;
  }
}
</style>

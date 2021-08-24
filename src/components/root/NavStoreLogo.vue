<template>
  <media-uploader
    class="nav-logo"
    :class="{ 'nav-logo--exist': filePath, 'nav-logo--disabled': !canModify }"
    :disabled="!canModify"
    @upload="changeLogo"
  >
    <template v-if="!filePath">
      <img src="@/assets/images/heseya.svg" alt="Heseya" class="nav-logo__logo" />
      <span v-if="canModify" class="nav-logo__title">Dodaj swoje logo</span>
    </template>
    <template v-else>
      <img :src="filePath" :alt="storeName" class="nav-logo__logo" />
      <span v-if="canModify" class="nav-logo__title">Zmień swoje logo</span>
    </template>
  </media-uploader>
</template>

<script lang="ts">
import Vue from 'vue'

import { CdnMedia } from '@/interfaces/Media'
import MediaUploader from '@/components/MediaUploader.vue'

const ENV_NAME = 'store_logo'

export default Vue.extend({
  components: { MediaUploader },
  data: () => ({
    filePath: '',
  }),
  computed: {
    storeName(): string {
      return this.$accessor.env.store_name
    },
    storeLogo(): string {
      return this.$accessor.env[ENV_NAME]
    },
    canModify(): boolean {
      return this.$can(this.$p.Settings.Edit)
    },
  },
  watch: {
    storeLogo(logo: string) {
      this.filePath = logo
    },
  },
  methods: {
    async changeLogo(file: CdnMedia) {
      await this.$accessor.settings.updateByKey({
        key: 'name',
        value: ENV_NAME,
        item: {
          name: ENV_NAME,
          value: file.url,
        },
      })
      this.filePath = file.url
    },
  },
})
</script>

<style lang="scss" scoped>
.nav-logo {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 8px 10px;
  border-radius: 8px;
  background-color: $backgroundColor;
  border: dashed 2px $backgroundAccentColor;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &--disabled {
    cursor: default;
  }

  &__title {
    font-size: 0.8em;
    letter-spacing: -0.24px;
    color: #159cff;
    transition: 0.3s;
  }

  &__logo {
    width: 130px;
    max-height: 70px;
    opacity: 0.4;
  }

  &--exist {
    background-color: #fff0;
    border: none;
  }

  &--exist &__logo {
    width: 150px;
    opacity: 1;
  }

  &--exist &__title {
    opacity: 0;
  }
  &--exist:hover &__title {
    opacity: 1;
  }
}
</style>

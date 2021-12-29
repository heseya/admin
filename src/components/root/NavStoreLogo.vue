<template>
  <media-uploader
    :key="storeLogoPath"
    class="nav-logo"
    :class="{
      'nav-logo--exist': storeLogoPath || disabled,
      'nav-logo--disabled': !canModify || disabled,
      'nav-logo--big': big,
    }"
    :disabled="!canModify"
    @upload="changeLogo"
  >
    <template v-if="!isLogoExist">
      <img src="@/assets/images/heseya.svg" alt="Heseya" class="nav-logo__logo" />
      <span v-if="canModify" class="nav-logo__title">Dodaj swoje logo</span>
    </template>
    <template v-else>
      <img :src="storeLogoPath" :alt="storeName" class="nav-logo__logo" />
      <span v-if="canModify" class="nav-logo__title">Zmień swoje logo</span>
    </template>
  </media-uploader>
</template>

<script lang="ts">
import Vue from 'vue'

import { CdnMedia } from '@/interfaces/Media'
import MediaUploader from '@/components/modules/media/MediaUploader.vue'

const ENV_NAME = 'store_logo'

export default Vue.extend({
  components: { MediaUploader },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    big: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    storeLogoPath: '',
  }),
  computed: {
    storeName(): string {
      return this.$accessor.env.store_name
    },
    envStoreLogo(): string {
      return this.$accessor.env[ENV_NAME]
    },
    canModify(): boolean {
      return this.$can(this.$p.Settings.Edit)
    },
    isLogoExist(): boolean {
      return !!this.storeLogoPath || !!this.envStoreLogo
    },
  },
  watch: {
    envStoreLogo(logo: string) {
      this.storeLogoPath = logo
    },
  },
  created() {
    this.storeLogoPath = this.envStoreLogo
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
      this.storeLogoPath = file.url
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
  background-color: $background-color-500;
  border: dashed 2px $primary-color-100;
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
    color: $primary-color-300;
    transition: 0.3s;
  }

  &__logo {
    width: 100%;
    max-width: 130px;
    max-height: 70px;
    object-fit: contain;
    opacity: 0.4;
  }

  &--exist {
    background-color: #ffffff00;
    border: none;
  }

  &--exist &__logo {
    max-width: 150px;
    opacity: 1;
  }

  &--big &__logo {
    max-width: 200px;
  }

  &--exist &__title {
    opacity: 0;
  }
  &--exist:hover &__title {
    opacity: 1;
  }
}
</style>

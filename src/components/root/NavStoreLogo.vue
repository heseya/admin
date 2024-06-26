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
      <span v-if="canModify" class="nav-logo__title">{{ $t('addLogo') }}</span>
    </template>
    <template v-else>
      <img :src="scaledLogoPath" :alt="storeName" class="nav-logo__logo" />
      <span v-if="canModify" class="nav-logo__title">{{ $t('changeLogo') }}</span>
    </template>
  </media-uploader>
</template>

<i18n lang="json">
{
  "pl": {
    "addLogo": "Dodaj swoje logo",
    "changeLogo": "Zmień swoje logo"
  },
  "en": {
    "addLogo": "Add your logo",
    "changeLogo": "Change your logo"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { CdnMedia } from '@heseya/store-core'

import MediaUploader from '@/components/modules/media/MediaUploader.vue'

const ENV_NAME = 'store_logo'

export default defineComponent({
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
      return this.$accessor.config.env.store_name
    },
    envStoreLogo(): string {
      return this.$accessor.config.env[ENV_NAME]
    },
    canModify(): boolean {
      return this.$can(this.$p.Settings.Edit)
    },
    isLogoExist(): boolean {
      return !!this.storeLogoPath || !!this.envStoreLogo
    },
    scaledLogoPath(): string {
      return this.storeLogoPath + `?w=${this.big ? '200' : '150'}`
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
  background-color: var(--background-color-500);
  border: dashed 2px var(--primary-color-100);
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
    color: var(--primary-color-300);
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
    background-color: $transparent;
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

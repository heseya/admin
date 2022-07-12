<template>
  <div class="meta-settings-page narrower-page">
    <top-nav :title="$t('title')" />

    <card>
      <a-alert type="info" show-icon :message="$t('message')" />
      <p></p>
      <SeoForm v-model="form" force-index :disabled="!$can($p.Seo.Edit)" />
      <br />
      <AppButton @click="submit"> {{ $t('save') }} </AppButton>
    </card>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Ustawienia SEO",
    "message": "Podane wartości będą wyświetlane wyłącznie na tych podstronach sklepu, które nie mają sprecyzowanych własnych ustawień SEO.",
    "savedMessage": "Globalne SEO zostało zaktualizowane",
    "errorMessage": "Wystąpił błąd podczas aktualizacji globalnego SEO",
    "save": "Zapisz zmiany"
  },
  "en": {
    "title": "SEO settings",
    "message": "The values entered here will be displayed only on pages of the store that do not have own SEO settings.",
    "savedMessage": "Global SEO has been updated",
    "errorMessage": "An error occurred while updating global SEO",
    "save": "Save changes"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { SeoMetadata, SeoMetadataDto } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import TopNav from '@/components/layout/TopNav.vue'
import SeoForm from '@/components/modules/seo/Form.vue'

import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: { Card, TopNav, SeoForm },
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  data: () => ({
    form: {} as SeoMetadata & SeoMetadataDto,
  }),
  computed: {
    globalSeo(): SeoMetadata | null {
      return this.$accessor.globalSeo.seo
    },
    error(): any {
      return this.$accessor.globalSeo.error
    },
  },
  watch: {
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
    globalSeo(globalSeo) {
      // no_index must be false on global SEO
      this.form = { ...globalSeo, og_image_id: globalSeo.og_image?.id, no_index: false }
    },
  },
  async created() {
    this.$accessor.startLoading()
    await this.$accessor.globalSeo.get()
    this.$accessor.stopLoading()
  },
  methods: {
    async submit() {
      this.$accessor.startLoading()
      const success = await this.$accessor.globalSeo.update(this.form)
      if (success) this.$toast.success(this.$t('savedMessage') as string)
      else this.$toast.error(this.$t('errorMessage') as string)
      this.$accessor.stopLoading()
    },
  },
})
</script>

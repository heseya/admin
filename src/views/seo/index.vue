<template>
  <div class="meta-settings-page narrower-page">
    <top-nav title="Ustawienia SEO" />

    <card>
      <a-alert
        type="info"
        show-icon
        message="Podane wartości będą wyświetlane wyłącznie na tych podstronach sklepu, które nie mają
        sprecyzowanych własnych ustawień SEO."
      />
      <p></p>
      <SeoForm v-model="form" force-index />
      <br />
      <AppButton @click="submit"> Zapisz zmiany </AppButton>
    </card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Card from '@/components/layout/Card.vue'
import TopNav from '@/components/layout/TopNav.vue'
import SeoForm from '@/components/modules/seo/Form.vue'

import { SeoMetadata, SeoMetadataDto } from '@/interfaces/SeoMetadata'

import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: { Card, TopNav, SeoForm },
  metaInfo: { title: 'Ustawienia SEO' },
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
      if (success) this.$toast.success('Globalne SEO zostało zaktualizowane')
      else this.$toast.error('Wystąpił błąd podczas aktualizacji')
      this.$accessor.stopLoading()
    },
  },
})
</script>

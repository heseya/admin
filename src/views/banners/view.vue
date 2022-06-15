<template>
  <div>
    <top-nav :title="!isNew ? banner.name : $t('newTitle')">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Banners.Remove"
        :title="$t('deleteText')"
        :ok-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
        @confirm="deleteBanner"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <BannerForm ref="form" v-model="form" :disabled="isDisabled" @submit="save">
      <template v-if="selectedBanner">
        <MetadataForm
          ref="publicMeta"
          :value="selectedBanner.metadata"
          :disabled="isDisabled"
          model="banners"
        />
        <MetadataForm
          v-if="selectedBanner.metadata_private"
          ref="privateMeta"
          :value="selectedBanner.metadata_private"
          :disabled="isDisabled"
          is-private
          model="banners"
        />
      </template>
    </BannerForm>
  </div>
</template>

<i18n>
{
  "pl": {
    "newTitle": "Nowy banner",
    "deleteText": "Czy na pewno chcesz usunąć ten banner?",
    "deletedMessage": "Banner został usunięty.",
    "createdMessage": "Banner został utworzony.",
    "updatedMessage": "Banner został zaktualizowany."
  },
  "en": {
    "newTitle": "New banner",
    "deleteText": "Are you sure you want to delete this banner?",
    "deletedMessage": "Banner has been deleted",
    "createdMessage": "Banner has been created",
    "updatedMessage": "Banner has been updated"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import { Banner, BannerCreateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import BannerForm from '@/components/modules/banners/Form.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { formatApiNotificationError } from '@/utils/errors'

const CLEAN_FORM: Banner = {
  id: '',
  name: '',
  slug: '',
  active: true,
  banner_media: [],
  metadata: {},
  metadata_private: {},
}

export default Vue.extend({
  metaInfo(this: any): any {
    const fallback = this.$t('newTitle') as string
    return {
      title: this.isNew ? fallback : this.banner?.name || fallback,
    }
  },
  components: {
    TopNav,
    PopConfirm,
    BannerForm,
    MetadataForm,
  },
  data: () => ({
    form: cloneDeep(CLEAN_FORM),
    selectedBanner: null as Banner | null,
  }),
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    banner(): Banner {
      return this.$accessor.banners.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.banners.getError
    },
    isLoading(): boolean {
      return this.$accessor.banners.isLoading
    },
    isDisabled(): boolean {
      return this.isNew ? !this.$can(this.$p.Banners.Add) : !this.$can(this.$p.Banners.Edit)
    },
  },
  watch: {
    banner(banner: Banner) {
      if (!this.isNew) {
        this.form = cloneDeep(banner)
        this.selectedBanner = banner
      }
    },
    error(error: any) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.banners.get(this.id)
      this.$accessor.stopLoading()
    }
  },
  methods: {
    async save() {
      this.$accessor.startLoading()
      const successMessage = this.isNew
        ? (this.$t('createdMessage') as string)
        : (this.$t('updatedMessage') as string)

      // Metadata can be saved only after banner is created
      if (this.selectedBanner) await this.saveMetadata(this.selectedBanner.id)

      const form: BannerCreateDto = {
        ...this.form,
        banner_media: this.form.banner_media.map((banner) => ({
          ...banner,
          media: banner.media.map((item) => ({
            ...item,
            media: item.media.id,
          })),
        })),
      }

      const banner = this.isNew
        ? await this.$accessor.banners.add(form)
        : await this.$accessor.banners.update({ id: this.id, item: form })

      ;(this.$refs.form as any).clearMediaToDelete()

      if (banner) {
        this.$toast.success(successMessage)
      }

      if (banner && banner.id !== this.id) this.$router.push(`/settings/banners/${banner.id}`)

      this.$accessor.stopLoading()
    },

    async deleteBanner() {
      this.$accessor.startLoading()
      const success = await this.$accessor.banners.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('deletedMessage') as string)
        this.$router.push('/settings/banners')
      }
      this.$accessor.stopLoading()
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },
  },
})
</script>

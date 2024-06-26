<template>
  <div class="banners-view">
    <top-nav :title="!isNew ? banner.name : $t('newTitle').toString()">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Banners.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
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

    <BannerForm
      ref="form"
      v-model="form"
      :edited-lang="editedLang"
      :disabled="isDisabled"
      @submit="save"
    >
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
          type="private"
          model="banners"
        />
      </template>
    </BannerForm>

    <AbsoluteContentLangSwitch :value="editedLang" @input="setEditedLang" />
  </div>
</template>

<i18n lang="json">
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
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { Banner, BannerCreateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import BannerForm from '@/components/modules/banners/Form.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { BannerMedia } from '@heseya/store-core'
import { TranslationsFromDto } from '@/interfaces/Translations'
import { BannerComponentForm } from '@/interfaces/Banner'
import AbsoluteContentLangSwitch from '@/components/lang/AbsoluteContentLangSwitch.vue'

const CLEAN_FORM: BannerComponentForm = {
  id: '',
  name: '',
  slug: '',
  active: true,
  banner_media: [],
  metadata: {},
  metadata_private: {},
}

const CLEAN_BANNER_MEDIA_TRANSLATABLE: TranslationsFromDto<BannerMedia> = {
  title: '',
  subtitle: '',
}

export default defineComponent({
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
    AbsoluteContentLangSwitch,
  },
  data: () => ({
    editedLang: '',
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
        this.form = cloneDeep({
          ...banner,
          banner_media: banner.banner_media.map((banner) => ({
            ...banner,
            translations: banner.translations || {},
          })),
        })
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
    this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
  },
  methods: {
    setEditedLang(langId: string) {
      this.editedLang = langId
      this.form.banner_media.forEach((banner) => {
        if (!banner.translations) this.$set(banner, 'translations', {})

        if (!banner.translations![langId])
          this.$set(banner.translations!, langId, { ...CLEAN_BANNER_MEDIA_TRANSLATABLE })
      })
    },

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
          translations: banner.translations!,
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
<style lang="scss" scoped>
.banners-view {
  position: relative;
  margin-right: 32px;
}
</style>

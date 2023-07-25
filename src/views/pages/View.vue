<template>
  <div class="narrower-page">
    <top-nav :title="!isNew ? page.name : $t('newTitle').toString()">
      <audits-modal :id="page.id" model="pages" />

      <pop-confirm
        v-if="!isNew"
        v-can="$p.Pages.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deletePage"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="page">
      <validation-observer v-slot="{ handleSubmit }">
        <card>
          <div class="page__info">
            <validated-input
              v-model="formName"
              rules="required"
              :label="$t('common.form.name')"
              :disabled="!canModify"
              @input="editSlug"
            />
            <validated-input
              v-model="form.slug"
              rules="required|slug"
              :label="$t('common.form.slug')"
              :disabled="!canModify"
            />
            <flex-input>
              <switch-input
                v-model="form.public"
                horizontal
                :label="$t('form.public').toString()"
                :disabled="!canModify"
              />
            </flex-input>
          </div>

          <br />
          <SeoForm
            v-model="formSeo"
            :disabled="!canModify"
            :current="!isNew ? { id, model: 'Page' } : undefined"
          />

          <br />
          <PublishedLangsForm v-model="form.published" />

          <br />
          <small class="label">{{ $t('form.content') }}</small>
          <RichEditor v-model="formContentHtml" :disabled="!canModify" />

          <br />

          <template v-if="!isNew">
            <MetadataForm
              ref="publicMeta"
              :value="page.metadata"
              :disabled="!canModify"
              model="pages"
            />
            <MetadataForm
              v-if="page.metadata_private"
              ref="privateMeta"
              :value="page.metadata_private"
              :disabled="!canModify"
              type="private"
              model="pages"
            />
          </template>

          <br />
          <app-button v-if="canModify" @click="handleSubmit(save)">
            {{ $t('common.save') }}
          </app-button>
        </card>
      </validation-observer>

      <ContentLangSwitch :value="editedLang" @input="setEditedLang" />
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Nowa strona",
    "deleteText": "Czy na pewno chcesz usunąć tą stronę?",
    "deletedMessage": "Strona została usunięty.",
    "createdMessage": "Strona została utworzona.",
    "updatedMessage": "Strona została zaktualizowana.",
    "form": {
      "public": "Widoczność strony",
      "content": "Treść"
    }
  },
  "en": {
    "newTitle": "New page",
    "deleteText": "Are you sure you want to delete this page?",
    "deletedMessage": "Page has been deleted",
    "createdMessage": "Page has been created",
    "updatedMessage": "Page has been updated",
    "form": {
      "public": "Page visibility",
      "content": "Content"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { Page, PageCreateDto, SeoMetadata } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import RichEditor from '@/components/form/RichEditor.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import SeoForm from '@/components/modules/seo/Accordion.vue'
import AuditsModal from '@/components/modules/audits/AuditsModal.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import ContentLangSwitch from '@/components/lang/ContentLangSwitch.vue'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { generateSlug } from '@/utils/generateSlug'

import { UUID } from '@/interfaces/UUID'
import { initializeSeoInTranslations } from '@/utils/translations'

export default defineComponent({
  metaInfo(this: any) {
    const fallback = this.$t('newTitle') as string
    return {
      title: this.isNew ? fallback : this.page?.name || fallback,
    }
  },
  components: {
    TopNav,
    Card,
    FlexInput,
    PopConfirm,
    RichEditor,
    ValidationObserver,
    SwitchInput,
    SeoForm,
    AuditsModal,
    MetadataForm,
    ContentLangSwitch,
    PublishedLangsForm,
  },
  data: () => ({
    editedLang: '',
    form: {
      slug: '',
      public: true,
      published: [],
      translations: {
        '': {
          name: '',
          content_html: '',
          seo: {},
        },
      },
    } as PageCreateDto,
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    page(): Page {
      return this.$accessor.pages.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.pages.getError
    },
    isLoading(): boolean {
      return this.$accessor.pages.isLoading
    },
    canModify(): boolean {
      return this.$can(this.isNew ? this.$p.Pages.Add : this.$p.Pages.Edit)
    },

    formContentHtml: {
      get(): string {
        return this.form.translations[this.editedLang]?.content_html || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].content_html = value
      },
    },
    formName: {
      get(): string {
        return this.form.translations[this.editedLang]?.name || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].name = value
      },
    },
    formSeo: {
      get(): SeoMetadata {
        return this.form.translations[this.editedLang]?.seo || {}
      },
      set(value: SeoMetadata) {
        this.form.translations[this.editedLang].seo = value
      },
    },
  },
  watch: {
    page(page: Page) {
      if (!this.isNew)
        this.form = {
          ...page,
          translations: initializeSeoInTranslations(page.translations),
        }
    },
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.pages.get(this.id)
      this.$accessor.stopLoading()
    }

    this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
  },
  methods: {
    setEditedLang(langId: string) {
      this.editedLang = langId
      if (!this.form.translations[langId])
        this.$set(this.form.translations, langId, { name: '', content_html: '', seo: {} })
    },

    editSlug() {
      if (this.isNew) this.form.slug = generateSlug(this.formName)
    },

    async save() {
      this.$accessor.startLoading()
      if (this.isNew) {
        const page = await this.$accessor.pages.add(this.form)
        if (page && page.id) {
          this.$toast.success(this.$t('createdMessage') as string)
          this.$router.push(`/pages/${page.id}`)
        }
      } else {
        // Metadata can be saved only after page is created
        await this.saveMetadata(this.id)

        const success = await this.$accessor.pages.update({
          id: this.id,
          item: this.form,
        })
        if (success) {
          this.$toast.success(this.$t('updatedMessage') as string)
        }
      }
      this.$accessor.stopLoading()
    },

    async deletePage() {
      this.$accessor.startLoading()
      const success = await this.$accessor.pages.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('deletedMessage') as string)
        this.$router.push('/pages')
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

<style lang="scss">
.page {
  position: relative;

  &__info {
    width: 100%;
    display: grid;
    grid-auto-flow: row;
    row-gap: 20px;
    margin-top: 15px;

    input {
      width: 100%;
    }

    .app-input {
      margin-bottom: 0;
    }
  }
}

@media ($viewport-11) {
  .page__info {
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 20px;
    grid-template-rows: 1fr;
    row-gap: 0;
  }
}
</style>

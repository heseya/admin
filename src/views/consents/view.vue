<template>
  <div class="narrower-page">
    <top-nav :title="!isNew ? $t('editTitle').toString() : $t('newTitle').toString()">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Consents.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deleteConsent"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>
    <ConsentsForm v-model="form" :edited-lang="editedLang" :disabled="isDisabled" @submit="save" />
    <AbsoluteContentLangSwitch :value="editedLang" @input="setEditedLang" />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Nowa zgoda",
    "editTitle": "Edytuj zgodę",
    "deleteText": "Czy na pewno chcesz usunąć tę zgodę?",
    "deletedMessage": "Zgoda została usunięta.",
    "createdMessage": "Zgoda została utworzona.",
    "updatedMessage": "Zgoda została zaktualizowana."
  },
  "en": {
    "newTitle": "New consent",
    "editTitle": "Edit consent",
    "deleteText": "Are you sure you want to delete this consent?",
    "deletedMessage": "Consent has been deleted",
    "createdMessage": "Consent has been created",
    "updatedMessage": "Consent has been updated"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { Consent, ConsentCreateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ConsentsForm from '@/components/modules/consents/Form.vue'
import AbsoluteContentLangSwitch from '@/components/lang/AbsoluteContentLangSwitch.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { TranslationsFromDto } from '@/interfaces/Translations'

const CLEAN_TRANSLATION_FORM: TranslationsFromDto<ConsentCreateDto> = {
  name: '',
  description_html: '',
}

const CLEAN_FORM: ConsentCreateDto = {
  required: true,
  translations: {},
  published: [],
}

export default defineComponent({
  metaInfo(this: any): any {
    const fallback = this.$t('newTitle') as string
    return {
      title: this.isNew ? fallback : this.consent?.name || fallback,
    }
  },
  components: {
    TopNav,
    PopConfirm,
    ConsentsForm,
    AbsoluteContentLangSwitch,
  },
  data: () => ({
    editedLang: '',
    form: cloneDeep(CLEAN_FORM),
  }),
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    consent(): Consent {
      return this.$accessor.consents.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.consents.getError
    },
    isLoading(): boolean {
      return this.$accessor.consents.isLoading
    },
    isDisabled(): boolean {
      return this.isNew ? !this.$can(this.$p.Consents.Add) : !this.$can(this.$p.Consents.Edit)
    },
  },
  watch: {
    consent(consent: Consent) {
      if (!this.isNew) {
        this.form = {
          ...cloneDeep(consent),
          translations: {
            ...cloneDeep(consent.translations),
          },
        }
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
      await this.$accessor.consents.get(this.id)
      this.$accessor.stopLoading()
    }

    this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
  },
  methods: {
    setEditedLang(langId: string) {
      this.editedLang = langId
      if (!this.form.translations[langId])
        this.$set(this.form.translations, langId, { ...CLEAN_TRANSLATION_FORM })
    },

    async save() {
      this.$accessor.startLoading()
      const successMessage = this.isNew
        ? (this.$t('createdMessage') as string)
        : (this.$t('updatedMessage') as string)

      const consent = this.isNew
        ? await this.$accessor.consents.add(this.form)
        : await this.$accessor.consents.update({ id: this.id, item: this.form })

      if (consent) {
        this.$toast.success(successMessage)
      }

      if (consent && consent.id !== this.id) this.$router.push(`/settings/consents/${consent.id}`)
      this.$accessor.stopLoading()
    },
    async deleteConsent() {
      this.$accessor.startLoading()
      const success = await this.$accessor.consents.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('deletedMessage') as string)
        this.$router.push('/settings/consents')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

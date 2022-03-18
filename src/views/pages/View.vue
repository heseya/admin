<template>
  <div class="narrower-page">
    <top-nav :title="!isNew ? page.name : $t('newTitle')">
      <audits-modal :id="page.id" model="pages" />

      <pop-confirm
        v-if="!isNew"
        v-can="$p.Pages.Remove"
        :title="$t('deleteText')"
        :ok-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
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
              v-model="form.name"
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
                :label="$t('form.public')"
                :disabled="!canModify"
              />
            </flex-input>
          </div>

          <br />
          <SeoForm
            v-model="form.seo"
            :disabled="!canModify"
            :current="!isNew ? { id, model: 'Page' } : null"
          />

          <br />
          <small class="label">{{ $t('form.content') }}</small>
          <RichEditor v-if="!isLoading" v-model="form.content_html" :disabled="!canModify" />

          <br />
          <app-button v-if="canModify" @click="handleSubmit(save)">
            {{ $t('common.save') }}
          </app-button>
        </card>
      </validation-observer>
    </div>
  </div>
</template>

<i18n>
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
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import RichEditor from '@/components/form/RichEditor.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import SeoForm from '@/components/modules/seo/Accordion.vue'
import AuditsModal from '@/components/modules/audits/AuditsModal.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { generateSlug } from '@/utils/generateSlug'

import { Page, PageDto } from '@/interfaces/Page'
import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
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
  },
  data: () => ({
    form: {
      name: '',
      slug: '',
      content_html: '',
      public: true,
      seo: {},
    } as PageDto,
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    page(): Page {
      return this.$accessor.pages.getSelected
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
  },
  watch: {
    page(page: Page) {
      if (!this.isNew) {
        this.form = { ...page, seo: page.seo || {} }
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
  },
  methods: {
    editSlug() {
      if (this.isNew) {
        this.form.slug = generateSlug(this.form.name)
      }
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
  },
})
</script>

<style lang="scss">
.page__info {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 30px 30px 20px;
  row-gap: 20px;
  margin-top: 15px;

  input {
    width: 100%;
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

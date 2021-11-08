<template>
  <div class="narrower-page">
    <top-nav :title="!isNew ? page.name : 'Nowa strona'">
      <audits-modal :id="page.id" model="pages" />

      <pop-confirm
        v-if="!isNew"
        v-can="$p.Pages.Remove"
        title="Czy na pewno chcesz usunąć tą stronę?"
        ok-text="Usuń"
        cancel-text="Anuluj"
        @confirm="deletePage"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          Usuń
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
              label="Nazwa"
              :disabled="!canModify"
              @input="editSlug"
            />
            <validated-input
              v-model="form.slug"
              rules="required|slug"
              label="Link"
              :disabled="!canModify"
            />
            <flex-input>
              <switch-input
                v-model="form.public"
                horizontal
                label="Widoczność strony"
                :disabled="!canModify"
              />
            </flex-input>
          </div>
          <br />
          <small class="label">Treść</small>
          <RichEditor v-if="!isLoading" v-model="form.content_html" :disabled="!canModify" />
          <br />
          <app-button v-if="canModify" @click="handleSubmit(save)"> Zapisz </app-button>
        </card>
      </validation-observer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import slugify from 'slugify'
import { ValidationObserver } from 'vee-validate'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import RichEditor from '@/components/form/RichEditor.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import AuditsModal from '@/components/modules/audits/AuditsModal.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { Page } from '@/interfaces/Page'

export default Vue.extend({
  metaInfo(): any {
    return { title: this.page?.name || 'Nowa strona' }
  },
  components: {
    TopNav,
    Card,
    FlexInput,
    PopConfirm,
    RichEditor,
    ValidationObserver,
    SwitchInput,
    AuditsModal,
  },
  data: () => ({
    form: {
      name: '',
      slug: '',
      content_md: '',
      content_html: '',
      public: true,
    },
  }),
  computed: {
    id(): string {
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
        this.form = { ...page }
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
        this.form.slug = slugify(this.form.name, { lower: true, remove: /[.]/g })
      }
    },
    async save() {
      this.$accessor.startLoading()
      if (this.isNew) {
        const page = await this.$accessor.pages.add(this.form)
        if (page && page.id) {
          this.$toast.success('Strona została utworzona.')
          this.$router.push(`/pages/${page.id}`)
        }
      } else {
        const success = await this.$accessor.pages.update({
          id: this.id,
          item: this.form,
        })
        if (success) {
          this.$toast.success('Strona została zaktualizowana.')
        }
      }
      this.$accessor.stopLoading()
    },
    async deletePage() {
      this.$accessor.startLoading()
      const success = await this.$accessor.pages.remove(this.id)
      if (success) {
        this.$toast.success('Strona została usunięta.')
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

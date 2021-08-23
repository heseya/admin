<template>
  <div>
    <top-nav :title="!isNew ? page.name : 'Nowa strona'">
      <pop-confirm
        v-if="!isNew"
        v-slot="{ open }"
        title="Czy na pewno chcesz usunąć tą stronę?"
        v-can="$p.Pages.Remove"
        okText="Usuń"
        cancelText="Anuluj"
        @confirm="deletePage"
      >
        <vs-button dark icon @click="open">
          <i class="bx bx-trash"></i>
        </vs-button>
      </pop-confirm>
    </top-nav>

    <div class="page">
      <validation-observer v-slot="{ handleSubmit }">
        <card>
          <div class="page__info">
            <validated-input
              rules="required"
              v-model="form.name"
              @input="editSlug"
              label="Nazwa"
              :disabled="!canModify"
            />
            <validated-input
              rules="required|slug"
              v-model="form.slug"
              label="Link"
              :disabled="!canModify"
            />
            <flex-input>
              <switch-input
                horizontal
                label="Widoczność strony"
                v-model="form.public"
                :disabled="!canModify"
              />
            </flex-input>
          </div>
          <br />
          <small class="label">Treść</small>
          <rich-editor v-if="!isLoading" v-model="form.content_html" :disabled="!canModify" />
          <br />
          <vs-button v-if="!canModify" color="dark" size="large" @click="handleSubmit(save)">
            Zapisz
          </vs-button>
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
import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { formatApiError } from '@/utils/errors'
import { Page } from '@/interfaces/Page'

export default Vue.extend({
  components: {
    TopNav,
    Card,
    FlexInput,
    PopConfirm,
    RichEditor,
    ValidationObserver,
    SwitchInput,
    ValidatedInput,
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
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
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
          this.$vs.notification({
            color: 'success',
            title: 'Strona została utworzona.',
          })
          this.$router.push(`/pages/${page.id}`)
        }
      } else {
        const success = await this.$accessor.pages.update({
          id: this.id,
          item: this.form,
        })
        if (success) {
          this.$vs.notification({
            color: 'success',
            title: 'Strona została zaktualizowana.',
          })
        }
      }
      this.$accessor.stopLoading()
    },
    async deletePage() {
      this.$accessor.startLoading()
      const success = await this.$accessor.pages.remove(this.id)
      if (success) {
        this.$vs.notification({
          color: 'success',
          title: 'Strona została usunięta.',
        })
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

  .vs-select-content {
    max-width: none;
  }
}

@media (min-width: $break) {
  .page__info {
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 20px;
    grid-template-rows: 1fr;
    row-gap: 0;
  }
}
</style>

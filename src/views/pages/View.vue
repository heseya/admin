<template>
  <div>
    <top-nav :title="!isNew ? page.name : 'Nowa strona'">
      <pop-confirm
        v-if="!isNew"
        title="Czy na pewno chcesz usunąć tą stronę?"
        okText="Usuń"
        cancelText="Anuluj"
        @confirm="deletePage"
        v-slot="{ open }"
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
            <validated-input rules="required" v-model="form.name" @input="editSlug" label="Nazwa" />
            <validated-input rules="required|slug" v-model="form.slug" label="Link" />
            <flex-input>
              <switch-input horizontal label="Widoczność strony" v-model="form.public" />
            </flex-input>
          </div>
          <br />
          <small class="label">Treść</small>
          <rich-editor v-if="!isLoading" v-model="form.content_html" />
          <br />
          <vs-button color="dark" size="large" @click="handleSubmit(save)"> Zapisz </vs-button>
        </card>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import slugify from 'slugify'
import { ValidationObserver } from 'vee-validate'
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import RichEditor from '@/components/RichEditor.vue'
import { formatApiError } from '@/utils/errors'
import SwitchInput from '@/components/SwitchInput.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

export default {
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
  data() {
    return {
      form: {
        name: '',
        slug: '',
        content_md: '',
        content_html: '',
        public: true,
      },
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    isNew() {
      return this.id === 'create'
    },
    page() {
      return this.$store.getters['pages/getSelected']
    },
    error() {
      return this.$store.getters['pages/getError']
    },
    isLoading() {
      return this.$store.state.pages.isLoading
    },
  },
  watch: {
    page(page) {
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
  methods: {
    editSlug() {
      if (this.isNew) {
        this.form.slug = slugify(this.form.name, { lower: true, remove: /[.]/g })
      }
    },
    async save() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.isNew) {
        const { id: newID } = await this.$store.dispatch('pages/add', this.form)
        if (newID) {
          this.$vs.notification({
            color: 'success',
            title: 'Strona została utworzona.',
          })
          this.$router.push(`/pages/${newID}`)
        }
      } else {
        const success = await this.$store.dispatch('pages/update', {
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
      loading.close()
    },
    async deletePage() {
      const loading = this.$vs.loading({ color: '#000' })
      const success = await this.$store.dispatch('pages/remove', this.id)
      if (success) {
        this.$vs.notification({
          color: 'success',
          title: 'Strona została usunięta.',
        })
        this.$router.push('/pages')
      }
      loading.close()
    },
  },
  async created() {
    if (!this.isNew) {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('pages/get', this.id)
      loading.close()
    }
  },
}
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

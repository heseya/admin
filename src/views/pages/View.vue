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
      <card>
        <div class="page__info">
          <vs-input v-model="form.name" label="Nazwa" />
          <vs-input v-model="form.slug" label="Link" />
          <flex-input>
            <label class="title">Widoczność strony</label>
            <vs-switch success v-model="form.public">
              <template #off>
                <i class="bx bx-x"></i>
              </template>
              <template #on>
                <i class="bx bx-check"></i>
              </template>
            </vs-switch>
          </flex-input>
        </div>
        <br />
        <md-editor v-model="form.content_md" />
        <br />
        <vs-button color="dark" size="large" @click="save">
          Zapisz
        </vs-button>
      </card>
    </div>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import FlexInput from '@/components/FlexInput.vue'
import PopConfirm from '@/components/PopConfirm.vue'
import MdEditor from '@/components/MdEditor.vue'

export default {
  components: {
    TopNav,
    Card,
    FlexInput,
    PopConfirm,
    MdEditor
  },
  data() {
    return {
      form: {
        name: '',
        slug: '',
        content_md: '',
        public: true
      }
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
    }
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
          title: error.message,
          text: error?.response?.data?.message
        })
      }
    }
  },
  methods: {
    async save() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.isNew) {
        const newID = await this.$store.dispatch('pages/add', this.form)
        if (newID) {
          this.$vs.notification({
            color: 'success',
            title: 'Strona została utworzona.'
          })
          this.$router.push(`/pages/${newID}`)
        }
      } else {
        const success = await this.$store.dispatch('pages/update', {
          id: this.id,
          item: this.form
        })
        if (success) {
          this.$vs.notification({
            color: 'success',
            title: 'Strona została zaktualizowana.'
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
          title: 'Strona została usunięta.'
        })
        this.$router.push('/pages')
      }
      loading.close()
    }
  },
  async created() {
    if (!this.isNew) {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('pages/get', this.id)
      loading.close()
    }
  }
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

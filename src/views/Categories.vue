<template>
  <div>
    <top-nav title="Kategorie">
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!categories.length">Nie ma żadnej kategorii</app-empty>
      <list>
        <list-item
          v-for="category in categories"
          :key="category.id"
          @click="openModal(category.id)"
          :hidden="!category.public"
        >
          {{ category.name }}
          <small>/{{ category.slug }}</small>
        </list-item>
      </list>
    </card>

    <vs-dialog width="550px" not-center v-model="isModalActive">
      <template #header>
        <h4>{{ editedItem.id ? 'Edycja' : 'Dodawanie' }} kategorii</h4>
      </template>
      <modal-form>
        <vs-input v-model="editedItem.name" label="Nazwa" />
        <vs-input v-model="editedItem.slug" label="Slug" />
        <div class="center">
          <flex-input>
            <label class="title">Widoczność kategorii</label>
            <vs-switch success v-model="editedItem.public">
              <template #off>
                <i class="bx bx-x"></i>
              </template>
              <template #on>
                <i class="bx bx-check"></i>
              </template>
            </vs-switch>
          </flex-input>
        </div>
      </modal-form>
      <template #footer>
        <div class="row">
          <vs-button color="dark" @click="saveModal">Zapisz</vs-button>
          <pop-confirm
            title="Czy na pewno chcesz usunąć tę kategorię?"
            okText="Usuń"
            cancelText="Anuluj"
            @confirm="deleteItem"
            v-slot="{ open }"
          >
            <vs-button v-if="editedItem.id" color="danger" @click="open">Usuń</vs-button>
          </pop-confirm>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ModalForm from '@/components/ModalForm.vue'
import ListItem from '@/components/ListItem.vue'
import FlexInput from '@/components/FlexInput.vue'
import Empty from '@/components/Empty.vue'
import PopConfirm from '@/components/PopConfirm.vue'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    ModalForm,
    PopConfirm,
    FlexInput,
    appEmpty: Empty
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      name: '',
      slug: '',
      public: true
    }
  }),
  computed: {
    categories() {
      return this.$store.getters['categories/getData']
    }
  },
  watch: {
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
    async getCategories() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('categories/fetch')
      loading.close()
    },
    openModal(id) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['categories/getFromListById'](id)
      } else {
        this.editedItem = {
          name: '',
          slug: '',
          public: true
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('categories/update', {
          id: this.editedItem.id,
          item: this.editedItem
        })
      } else {
        await this.$store.dispatch('categories/add', this.editedItem)
      }
      loading.close()
      this.isModalActive = false
    },
    async deleteItem() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('categories/remove', this.editedItem.id)
      loading.close()
      this.isModalActive = false
    }
  },
  created() {
    this.getCategories()
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  }
}
</script>

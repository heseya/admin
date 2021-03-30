<template>
  <div>
    <top-nav title="Kody rabatowe">
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!discounts.length">Nie ma jeszcze żadnych kodów rabatowych</app-empty>
      <list>
        <list-item
          v-for="discount in discounts"
          :key="discount.id"
          @click="openModal(discount.id)"
        >
          {{ discount.code }}
          <small>{{ discount.description }}</small>
        </list-item>
      </list>
    </card>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja kodu rabatowego' : 'Nowy kod rabatowy' }}</h4>
        </template>
        <modal-form>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.code" @input="editSlug" label="Kod">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider v-slot="{ errors }">
            <vs-input v-model="editedItem.description" label="Opis">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.discount" label="Zniżka">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.type" label="Typ">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć ten kod?"
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
    </validation-observer>
  </div>
</template>

<script>
import slugify from 'slugify'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ModalForm from '@/components/ModalForm.vue'
import ListItem from '@/components/ListItem.vue'
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
    appEmpty: Empty,
    ValidationProvider,
    ValidationObserver
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
    discounts() {
      return this.$store.getters['discounts/getData']
    }
  },
  watch: {
    error(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          title: error.message,
          text: error.response.data?.error?.message
        })
      }
    }
  },
  methods: {
    async getCategories() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('discounts/fetch')
      loading.close()
    },
    editSlug() {
      this.editedItem.slug = slugify(this.editedItem.name, { lower: true, remove: /[.]/g })
    },
    openModal(id) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['discounts/getFromListById'](id)
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
        await this.$store.dispatch('discounts/update', {
          id: this.editedItem.id,
          item: this.editedItem
        })
      } else {
        await this.$store.dispatch('discounts/add', this.editedItem)
      }
      loading.close()
      this.isModalActive = false
    },
    async deleteItem() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('discounts/remove', this.editedItem.id)
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

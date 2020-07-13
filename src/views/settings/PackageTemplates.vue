<template>
  <div>
    <top-nav title="Opcje Dostawy">
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!packageTemplates.length">Nie ma żadnego szablonu przesyłki</app-empty>
      <list>
        <list-item
          v-for="packageTemplate in packageTemplates"
          :key="packageTemplate.id"
          @click="openModal(packageTemplate.id)"
        >
          {{ packageTemplate.name }}
          <small>
            waga: <b>{{ packageTemplate.weight }}kg</b>,
            wysokość: <b>{{ packageTemplate.height }}cm</b>,
            szerokość: <b>{{ packageTemplate.width }}cm</b>,
            głębokość: <b>{{ packageTemplate.depth }}cm</b>
          </small>
        </list-item>
      </list>
    </card>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja' : 'Dodawanie' }} szablonu przesyłki</h4>
        </template>
        <modal-form>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.name" label="Nazwa">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required|positive" v-slot="{ errors }">
            <vs-input v-model="editedItem.weight" type="number" label="Waga (kg)">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required|positive" v-slot="{ errors }">
            <vs-input v-model="editedItem.width" type="number" label="Szerokość (cm)">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required|positive" v-slot="{ errors }">
            <vs-input v-model="editedItem.height" type="number" label="Wysokość (cm)">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required|positive" v-slot="{ errors }">
            <vs-input v-model="editedItem.depth" type="number" label="Głębokość (cm)">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>

        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć ten szablon dostawy?"
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
      width: 0,
      height: 0,
      depth: 0,
      weight: 0
    }
  }),
  computed: {
    packageTemplates() {
      return this.$store.getters['packageTemplates/getData']
    },
    error() {
      return this.$store.getters['packageTemplates/getError']
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
    openModal(id) {
      this.isModalActive = true
      if (id) {
        const item = this.$store.getters['packageTemplates/getFromListById'](id)
        this.editedItem = { ...item }
      } else {
        this.editedItem = {
          name: '',
          width: 0,
          height: 0,
          depth: 0,
          weight: 0
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('packageTemplates/update', {
          id: this.editedItem.id,
          item: this.editedItem
        })
      } else {
        await this.$store.dispatch('packageTemplates/add', this.editedItem)
      }
      loading.close()
      this.isModalActive = false
    },
    async deleteItem() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('packageTemplates/remove', this.editedItem.id)
      loading.close()
      this.isModalActive = false
    }
  },
  async created() {
    const loading = this.$vs.loading({ color: '#000' })
    await this.$store.dispatch('packageTemplates/fetch')
    loading.close()
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

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
}

</style>

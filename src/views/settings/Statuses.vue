<template>
  <div>
    <top-nav title="Statusy zamówień">
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!statuses.length">Nie ma żadnych statusów</app-empty>
      <list>
        <draggable v-model="statuses">
          <list-item
            v-for="status in statuses"
            :key="status.id"
            @click="openModal(status.id)"
          >
            <template #avatar>
              <vs-avatar :color="`#${status.color}`" />
            </template>
            {{ status.name }}
            <small>{{ status.description }}</small>
          </list-item>
        </draggable>
      </list>
    </card>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja statusu' : 'Nowy status' }}</h4>
        </template>
        <modal-form>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.name" label="Nazwa">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.description" label="Opis">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input :value="`#${editedItem.color}`" label="Kolor statusu" @input="setColor" type="color">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć ten status?"
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
import Draggable from 'vuedraggable'

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
    ValidationObserver,
    Draggable,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      name: '',
      description: '',
      color: ''
    }
  }),
  computed: {
    statuses: {
      get() {
        return this.$store.getters['statuses/getData']
      },
      async set(val) {
        const loading = this.$vs.loading({ color: '#000' })
        await this.$store.dispatch('statuses/setOrder', val.map((status) => status.id))
        await this.$store.dispatch('statuses/fetch')
        loading.close()
      }
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
    setColor(color) {
      this.editedItem.color = color.split('#')[1] ?? color
    },
    async getStatuses() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('statuses/fetch')
      loading.close()
    },
    openModal(id) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['statuses/getFromListById'](id)
        this.setColor(this.editedItem.color)
      } else {
        this.editedItem = {
          name: '',
          description: '',
          color: '000000'
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('statuses/update', {
          id: this.editedItem.id,
          item: this.editedItem
        })
      } else {
        await this.$store.dispatch('statuses/add', this.editedItem)
      }
      loading.close()
      this.isModalActive = false
    },
    async deleteItem() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('statuses/remove', this.editedItem.id)
      loading.close()
      this.isModalActive = false
    }
  },
  created() {
    this.getStatuses()
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

<style lang="scss">
input[type="color"] {
  height: 30px !important;
}
</style>

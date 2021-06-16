<template>
  <div>
    <PaginatedList title="Statusy zamówień" storeKey="statuses" draggable>
      <template #nav>
        <vs-button @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>
      <template v-slot="{ item: status }">
        <list-item @click="openModal(status.id)">
          <template #avatar>
            <vs-avatar :color="`#${status.color}`" />
          </template>
          {{ status.name }}
          <small>{{ status.description }}</small>
        </list-item>
      </template>
    </PaginatedList>

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
            <vs-input
              :value="`#${editedItem.color}`"
              label="Kolor statusu"
              @input="setColor"
              type="color"
            >
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <SwitchInput v-model="editedItem.cancel">
            <template #title>Anulowanie zamówienia</template>
          </SwitchInput>
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
import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SwitchInput from '@/components/SwitchInput.vue'

export default {
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationProvider,
    ValidationObserver,
    SwitchInput,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      name: '',
      description: '',
      color: '',
    },
  }),
  methods: {
    setColor(color) {
      this.editedItem.color = color.split('#')[1] ?? color
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
          color: '000000',
          cancel: false,
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('statuses/update', {
          id: this.editedItem.id,
          item: this.editedItem,
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
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
}
</script>

<style lang="scss">
input[type='color'] {
  height: 30px !important;
}
</style>

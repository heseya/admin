<template>
  <div>
    <top-nav title="Ustawienia zaawansowane">
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!settings.length">Nie ma żadnych ustawień</app-empty>
      <list>
        <list-item
          v-for="setting in settings"
          :key="setting.name"
          @click="openModal(setting)"
          :hidden="!setting.public"
        >
          {{ setting.name }}
          <small>{{ setting.value }}</small>
        </list-item>
      </list>
    </card>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja ustawienie' : 'Nowe ustawienie' }}</h4>
        </template>
        <modal-form>
          <validation-provider rules="required|letters-only" v-slot="{ errors }">
            <vs-input v-model="editedItem.name" label="Klucz" :disabled="editedItem.permanent">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.value" label="Wartość">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <SwitchInput v-model="editedItem.public">
            <template #title>Wartość publiczna</template>
          </SwitchInput>
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć to ustawienie?"
              okText="Usuń"
              cancelText="Anuluj"
              @confirm="deleteItem"
              v-slot="{ open }"
            >
              <vs-button
                v-if="editedItem.id"
                color="danger"
                :disabled="editedItem.permanent"
                @click="open"
                >Usuń</vs-button
              >
            </pop-confirm>
          </div>
        </template>
      </vs-dialog>
    </validation-observer>
  </div>
</template>

<script>
import clone from 'lodash/clone'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ModalForm from '@/components/ModalForm.vue'
import ListItem from '@/components/ListItem.vue'
import Empty from '@/components/Empty.vue'
import SwitchInput from '@/components/SwitchInput.vue'
import PopConfirm from '@/components/PopConfirm.vue'
import { formatApiError } from '@/utils/errors'

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
    SwitchInput,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      name: '',
      value: '',
      permanent: false,
      public: true,
    },
  }),
  computed: {
    settings() {
      return this.$store.getters['settings/getData']
    },
    error() {
      return this.$store.getters['settings/getError']
    },
  },
  watch: {
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
    async getSettings() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('settings/fetch')
      loading.close()
    },
    openModal(item) {
      this.isModalActive = true
      if (item) {
        this.editedItem = { id: item.name, ...clone(item) }
      } else {
        this.editedItem = {
          name: '',
          value: '',
          permanent: false,
          public: true,
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('settings/updateByKey', {
          key: 'name',
          value: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$store.dispatch('settings/add', this.editedItem)
      }
      await this.$store.dispatch('fetchEnv')
      loading.close()
      this.isModalActive = false
    },
    async deleteItem() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('settings/removeByKey', { key: 'name', value: this.editedItem.id })
      loading.close()
      this.isModalActive = false
    },
  },
  created() {
    this.getSettings()
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

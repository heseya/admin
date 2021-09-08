<template>
  <div>
    <PaginatedList title="Ustawienia zaawansowane" storeKey="settings">
      <template #nav>
        <vs-button @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>
      <template v-slot="{ item: setting }">
        <list-item @click="openModal(setting)" :hidden="!setting.public">
          {{ setting.name }}
          <small>{{ setting.value }}</small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja ustawienie' : 'Nowe ustawienie' }}</h4>
        </template>
        <modal-form>
          <validated-input
            rules="required|letters-only"
            v-model="editedItem.name"
            label="Klucz"
            :disabled="editedItem.permanent"
          />

          <validated-input rules="required" v-model="editedItem.value" label="Wartość" />

          <SwitchInput v-model="editedItem.public" label="Wartość publiczna" horizontal />
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
              >
                Usuń
              </vs-button>
            </pop-confirm>
          </div>
        </template>
      </vs-dialog>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import clone from 'lodash/clone'
import { ValidationObserver } from 'vee-validate'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { Setting } from '@/interfaces/Settings'

const CLEAR_SETTING: Setting = {
  id: '',
  name: '',
  value: '',
  permanent: false,
  public: true,
}

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    SwitchInput,
    ValidatedInput,
  },
  data: () => ({
    isModalActive: false,
    editedItem: clone(CLEAR_SETTING),
  }),
  methods: {
    openModal(item?: Setting) {
      this.isModalActive = true
      if (item) {
        this.editedItem = { ...clone(item), id: item.name }
      } else {
        this.editedItem = clone(CLEAR_SETTING)
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$accessor.settings.updateByKey({
          key: 'name',
          value: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$accessor.settings.add(this.editedItem)
      }
      await this.$accessor.fetchEnv()
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.settings.removeByKey({ key: 'name', value: this.editedItem.id })
      this.$accessor.stopLoading()
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
})
</script>

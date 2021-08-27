<template>
  <div>
    <PaginatedList title="Ustawienia zaawansowane" store-key="settings">
      <template #nav>
        <vs-button v-can="$p.Settings.Add" color="dark" icon @click="openModal()">
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>
      <template v-slot="{ item: setting }">
        <list-item :hidden="!setting.public" @click="openModal(setting)">
          {{ setting.name }}
          <small>{{ setting.value }}</small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? 'Edycja ustawienie' : 'Nowe ustawienie'"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.name"
            rules="required|letters-only"
            label="Klucz"
            :disabled="editedItem.permanent || !canModify"
          />

          <validated-input
            v-model="editedItem.value"
            :disabled="!canModify"
            rules="required"
            label="Wartość"
          />

          <SwitchInput
            v-model="editedItem.public"
            :disabled="!canModify"
            label="Wartość publiczna"
            horizontal
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button v-if="canModify" color="dark" @click="handleSubmit(saveModal)">
              Zapisz
            </vs-button>
            <pop-confirm
              v-slot="{ open }"
              v-can="$p.Settings.Remove"
              title="Czy na pewno chcesz usunąć to ustawienie?"
              ok-text="Usuń"
              cancel-text="Anuluj"
              @confirm="deleteItem"
            >
              <vs-button
                v-if="editedItem.id"
                v-can="$p.Settings.Remove"
                color="danger"
                :disabled="editedItem.permanent"
                @click="open"
              >
                Usuń
              </vs-button>
            </pop-confirm>
          </div>
        </template>
      </a-modal>
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
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Settings.Edit : this.$p.Settings.Add)
    },
  },
  methods: {
    openModal(item?: Setting) {
      if (!this.$verboseCan(this.$p.Settings.ShowDetails)) return

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

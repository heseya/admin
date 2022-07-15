<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="settings">
      <template #nav>
        <icon-button v-can="$p.Settings.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
      <template #default="{ item: setting }">
        <list-item :key="setting.id" :hidden="!setting.public" @click="openModal(setting)">
          {{ setting.name }}
          <small>{{ setting.value }}</small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? $t('editTitle') : $t('newTitle')"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.name"
            rules="required|letters-only"
            :label="$t('form.name')"
            :disabled="editedItem.permanent || !canModify"
          />

          <validated-input
            v-model="editedItem.value"
            :disabled="!canModify"
            rules="required"
            :label="$t('form.value')"
          />

          <SwitchInput
            v-model="editedItem.public"
            :disabled="!canModify"
            :label="$t('form.public')"
            horizontal
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)">
              {{ $t('common.save') }}
            </app-button>
            <pop-confirm
              v-can="$p.Settings.Remove"
              :title="$t('deleteText')"
              :ok-text="$t('common.delete')"
              :cancel-text="$t('common.cancel')"
              @confirm="deleteItem"
            >
              <app-button
                v-if="editedItem.id"
                v-can="$p.Settings.Remove"
                type="danger"
                :disabled="editedItem.permanent"
              >
                {{ $t('common.delete') }}
              </app-button>
            </pop-confirm>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Ustawienia zaawansowane",
    "add": "Dodaj ustawienie",
    "editTitle": "Edycja ustawienia",
    "newTitle": "Nowy ustawienie",
    "deleteText": "Czy na pewno chcesz usunąć to ustawienie?",
    "form": {
      "name": "Klucz",
      "value": "Wartość",
      "public": "Wartość publiczna"
    }
  },
  "en": {
    "title": "Advanced settings",
    "add": "Add setting",
    "editTitle": "Edit setting",
    "newTitle": "New setting",
    "deleteText": "Are you sure you want to delete this setting?",
    "form": {
      "name": "Key",
      "value": "Value",
      "public": "Public value"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import clone from 'lodash/clone'
import { ValidationObserver } from 'vee-validate'
import { Setting } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'

const CLEAR_SETTING: Setting = {
  id: '',
  name: '',
  value: '',
  permanent: false,
  public: true,
}

export default Vue.extend({
  metaInfo(this: any) {
    return {
      title: this.$t('title') as string,
    }
  },
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    SwitchInput,
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
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
      await this.$accessor.config.fetchEnv()
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
})
</script>

<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="providers">
      <template #nav> </template>
      <template #default="{ item: provider }">
        <list-item :key="provider.key" @click="openModal(provider.key)">
          {{ capitalize(provider.key) }}
          <template #action>
            <boolean-tag
              :value="provider.active"
              :true-text="$t('common.active')"
              :false-text="$t('common.inactive')"
            />
          </template>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }" v-can="$p.Auth.ProvidersManage">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="$t('common.edit') + ' ' + capitalize(editedItem.key)"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.client_id"
            :disabled="!editedItem.active"
            :rules="{ required: editedItem.active }"
            :label="$t('clientId')"
          />
          <validated-input
            v-model="editedItem.client_secret"
            :disabled="!editedItem.active"
            :rules="{ required: editedItem.active }"
            :label="$t('secretId')"
          />
          <br />
          <switch-input v-model="editedItem.active" :label="$t('common.active')" horizontal />
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button @click="handleSubmit(saveProvider)">
              {{ $t('common.save') }}
            </app-button>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Logowanie przez social media",
    "clientId": "Client ID",
    "secretId": "Secret ID",
    "success": "Provider logowania został zapisany"
  },
  "en": {
    "title": "Login via social media",
    "clientId": "Client ID",
    "secretId": "Secret ID",
    "success": "Login provider has been saved successfully"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import capitalize from 'lodash/capitalize'
import { api } from '@/api'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import ModalForm from '@/components/form/ModalForm.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { UUID } from '@/interfaces/UUID'
import { AuthProvider } from '@/interfaces/Providers'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    ValidationObserver,
    PaginatedList,
    ListItem,
    ModalForm,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {} as AuthProvider,
  }),
  methods: {
    capitalize(text: string) {
      return capitalize(text)
    },
    async openModal(key: UUID) {
      const { data: provider } = await api.get<AuthProvider>(`/auth/providers/${key}`)
      this.editedItem = provider
      this.isModalActive = true
    },
    async saveProvider() {
      this.$accessor.startLoading()

      try {
        await this.$accessor.providers.updateByKey({
          key: 'key',
          value: this.editedItem.key,
          item: this.editedItem,
        })
        this.$toast.success(this.$t('success') as string)
      } catch (error: any) {
        this.$toast.error(formatApiNotificationError(error))
      }

      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
})
</script>

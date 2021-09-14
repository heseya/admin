<template>
  <div>
    <PaginatedList title="Aplikacje" store-key="apps">
      <template #nav>
        <icon-button @click="openInstallModal()">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj aplikacje
        </icon-button>
      </template>

      <template #default="{ item: app }">
        <list-item @click="openConfigureModal(app)">
          <template #avatar>
            <avatar>
              <img v-if="app.icon" :src="`${app.url}${app.icon}`" />
              <i v-else class="bx bxs-extension" />
            </avatar>
          </template>
          {{ app.name }}
          <small>{{ app.description }}</small>

          <small slot="action">{{ app.author }} | v{{ app.version }}</small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal v-model="isInstallModalActive" width="550px" title="Dodaj aplikacje" footer="">
        <add-app-form v-model="installForm" @submit="handleSubmit(installApplication)" />
      </a-modal>
    </validation-observer>

    <a-modal
      v-model="isConfigureModalActive"
      width="550px"
      :title="`Konfiguracja ${configuratedApp.name}`"
      footer=""
    >
      <configure-app-form :app="configuratedApp" @close="isConfigureModalActive = false" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'

import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import Avatar from '@/components/layout/Avatar.vue'
import AddForm from '@/components/modules/apps/AddForm.vue'
import ConfigureAppForm from '@/components/modules/apps/ConfigureAppForm.vue'

import { App, CreateAppDto } from '@/interfaces/App'

const CLEAN_FORM: CreateAppDto = {
  app_url: '',
  app_name: '',
  licence_key: '',
  allowed_permissions: [],
}

export default Vue.extend({
  metaInfo: { title: 'Aplikacje' },
  components: {
    ListItem,
    ValidationObserver,
    PaginatedList,
    Avatar,
    AddAppForm: AddForm,
    ConfigureAppForm,
  },
  data: () => ({
    isInstallModalActive: false,
    isConfigureModalActive: false,
    installForm: cloneDeep(CLEAN_FORM),
    configuratedApp: {} as Record<string, any>,
  }),
  methods: {
    openInstallModal() {
      this.isInstallModalActive = true
      this.installForm = cloneDeep(CLEAN_FORM)
    },
    openConfigureModal(app: App) {
      this.isConfigureModalActive = true
      this.configuratedApp = app
    },

    async installApplication() {
      this.$accessor.startLoading()
      await this.$accessor.apps.add(this.installForm)
      this.$accessor.stopLoading()
      this.isInstallModalActive = false
    },
  },
})
</script>

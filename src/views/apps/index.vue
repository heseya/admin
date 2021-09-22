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
              <img v-if="app.icon" :src="app.icon" />
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
      :visible="isConfigureModalActive"
      width="550px"
      :title="`Konfiguracja aplikacji ${configuratedApp && configuratedApp.name}`"
      footer=""
      @cancel="closeConfigurationModal"
    >
      <configure-app-form
        :app="configuratedApp"
        @close="closeConfigurationModal"
        @uninstall="uninstallApp"
      />
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
  url: '',
  name: '',
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
    configuratedApp: null as App | null,
  }),
  methods: {
    openInstallModal() {
      this.isInstallModalActive = true
      this.installForm = cloneDeep(CLEAN_FORM)
    },
    openConfigureModal(app: App) {
      // ? Only to allow local apps to work on docker
      app.url = app.url.replace('host.docker.internal', 'localhost')

      if (app.microfrontend_url) {
        this.$router.push(`/apps/${app.id}/`)
        return
      }

      this.isConfigureModalActive = true
      this.configuratedApp = app
    },
    closeConfigurationModal() {
      this.configuratedApp = null
      this.$nextTick(() => {
        this.isConfigureModalActive = false
      })
    },

    async installApplication() {
      this.$accessor.startLoading()

      await this.$accessor.apps.add({
        ...this.installForm,
        // ? Only to allow local apps to work on docker
        url: this.installForm.url.replace('localhost', 'host.docker.internal'),
      })
      this.$accessor.stopLoading()
      this.isInstallModalActive = false
    },

    async uninstallApp(force = false) {
      const app = this.configuratedApp
      if (!app) return

      this.$accessor.startLoading()

      const success = await this.$accessor.apps.remove({
        value: app.id,
        params: { force: force ? 1 : undefined },
      })

      this.$accessor.stopLoading()

      if (success) {
        this.$toast.success('Aplikacja została odinstalowana')
        this.isConfigureModalActive = false
      } else {
        if (!force)
          this.$confirm({
            title:
              'Aplikacji nie udało się odinstalować, ponieważ nie odpowiada. Czy chcesz ją usunąć siłą?',
            okText: 'Odinstaluj',
            okType: 'danger',
            onOk: () => {
              this.uninstallApp(true)
            },
          })
        else this.$toast.error('Aplikacja nie może zostać odinstalowana')
      }
    },
  },
})
</script>

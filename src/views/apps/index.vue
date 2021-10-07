<template>
  <div class="narrower-page">
    <PaginatedList title="Aplikacje" store-key="apps">
      <template #nav>
        <icon-button v-can="$p.Apps.Install" @click="openInstallModal()">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj aplikacje
        </icon-button>
      </template>

      <template #default="{ item: app }">
        <list-item no-hover>
          <template #avatar>
            <avatar>
              <img v-if="app.icon" :src="app.icon" />
              <i v-else class="bx bxs-extension" />
            </avatar>
          </template>
          {{ app.name }}
          <small>{{ app.description }}</small>

          <small slot="action">
            <div class="app-action">
              <span> {{ app.author }} | v{{ app.version }} </span>

              <icon-button size="small" @click="openConfigureModal(app)">
                <i v-if="app.microfrontend_url" slot="icon" class="bx bx-log-in"></i>
                <i v-else slot="icon" class="bx bx-edit"></i>
              </icon-button>

              <pop-confirm
                v-can="$p.Apps.Remove"
                title="Czy na pewno chcesz odinstalować tę aplikację?"
                ok-text="Usuń"
                cancel-text="Anuluj"
                @confirm="uninstallApp(app)"
              >
                <icon-button size="small" type="danger">
                  <i slot="icon" class="bx bxs-trash"></i>
                </icon-button>
              </pop-confirm>
            </div>
          </small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit, valid }">
      <a-modal v-model="isInstallModalActive" width="550px" title="Dodaj aplikacje" footer="">
        <add-app-form
          v-model="installForm"
          :is-valid-url="valid"
          @submit="handleSubmit(installApplication)"
        />
      </a-modal>
    </validation-observer>

    <a-modal
      :visible="isConfigureModalActive"
      width="550px"
      :title="`Konfiguracja aplikacji ${configuratedApp && configuratedApp.name}`"
      footer=""
      @cancel="closeConfigurationModal"
    >
      <configure-app-form :app="configuratedApp" @close="closeConfigurationModal" />
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
import PopConfirm from '@/components/layout/PopConfirm.vue'

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
    PopConfirm,
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

    async uninstallApp(app: App, force = false) {
      if (!app) return

      this.$accessor.startLoading()

      const success = await this.$accessor.apps.remove({
        value: app.id,
        params: { force: Number(force) },
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
              this.uninstallApp(app, true)
            },
          })
        else this.$toast.error('Aplikacja nie może zostać odinstalowana')
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.app-action {
  display: flex;
  align-items: center;

  span {
    margin-right: 8px;
  }
}
</style>

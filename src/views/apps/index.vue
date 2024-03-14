<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title').toString()" store-key="apps">
      <template #nav>
        <icon-button v-can="$p.Apps.Install" @click="openInstallModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: app }">
        <list-item :key="app.id" no-hover>
          <template #avatar>
            <avatar>
              <img v-if="app.icon" :src="app.icon" />
              <i v-else class="bx bxs-extension" />
            </avatar>
          </template>
          {{ app.name }}
          <small>{{ app.description }}</small>

          <template #action>
            <small>
              <div class="app-action">
                <span class="app-action__text"> {{ app.author }} | v{{ app.version }} </span>

                <icon-button size="small" @click="openConfigureModal(app)">
                  <template #icon>
                    <i class="bx bx-edit"></i>
                  </template>
                </icon-button>

                <icon-button
                  v-if="app.microfrontend_url"
                  size="small"
                  @click="goToMicrofrontend(app)"
                >
                  <template #icon>
                    <i class="bx bx-log-in"></i>
                  </template>
                </icon-button>

                <icon-button size="small" @click="openActionsModal(app)">
                  <template #icon>
                    <i class="bx bx-play-circle"></i>
                  </template>
                </icon-button>

                <pop-confirm
                  v-can="$p.Apps.Remove"
                  :title="$t('deleteText').toString()"
                  :ok-text="$t('deleteConfirm').toString()"
                  :cancel-text="$t('common.cancel').toString()"
                  @confirm="uninstallApp(app)"
                >
                  <icon-button size="small" type="danger">
                    <template #icon>
                      <i class="bx bxs-trash"></i>
                    </template>
                  </icon-button>
                </pop-confirm>
              </div>
            </small>
          </template>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit, errors }">
      <a-modal v-model="isInstallModalActive" width="550px" :title="$t('add')" footer="">
        <add-app-form
          v-model="installForm"
          :is-valid-url="errors.url ? errors.url.length === 0 : true"
          @submit="handleSubmit(installApplication)"
        />
      </a-modal>
    </validation-observer>

    <a-modal
      :visible="isConfigureModalActive"
      width="550px"
      :title="`${$t('editTitle')} ${configuratedApp && configuratedApp.name}`"
      footer=""
      @cancel="closeConfigurationModal"
    >
      <configure-app-form :app="configuratedApp" @close="closeConfigurationModal" />
    </a-modal>

    <a-modal
      :visible="isActionModalActive"
      width="800px"
      :title="`${$t('actionsTitle')} ${configuratedApp && configuratedApp.name}`"
      footer=""
      @cancel="closeActionsModal"
    >
      <actions-list :app="configuratedApp" @close="closeActionsModal" />
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Aplikacje",
    "add": "Dodaj aplikacje",
    "editTitle": "Konfiguracja aplikacji",
    "actionsTitle": "Akcje aplikacji",
    "deleteText": "Czy na pewno chcesz odinstalować te aplikację?",
    "deleteForceText": "Aplikacji nie udało się odinstalować, ponieważ nie odpowiada. Czy chcesz ją usunąć siłą?",
    "deleteConfirm": "Odinstaluj",
    "deleteMessage": "Aplikacja została odinstalowana",
    "deleteFailed": "Aplikacja nie może być odinstalowana"
  },
  "en": {
    "title": "Applications",
    "add": "Add application",
    "editTitle": "Application configuration",
    "actionsTitle": "Application actions",
    "deleteText": "Are you sure you want to uninstall this application?",
    "deleteForceText": "Application could not be uninstalled, because it does not respond. Do you want to delete it?",
    "deleteConfirm": "Uninstall",
    "deleteMessage": "Application has been uninstalled",
    "deleteFailed": "Application could not be uninstalled"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'
import { App, AppCreateDto } from '@heseya/store-core'

import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import Avatar from '@/components/layout/Avatar.vue'
import AddForm from '@/components/modules/apps/AddForm.vue'
import ConfigureAppForm from '@/components/modules/apps/ConfigureAppForm.vue'
import ActionsList from '@/components/modules/apps/ActionsList.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import { trimSlash } from '@/utils/trimSlash'

const CLEAN_FORM: AppCreateDto = {
  url: '',
  name: '',
  licence_key: '',
  public_app_permissions: [],
  allowed_permissions: [],
}

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    ListItem,
    ValidationObserver,
    PaginatedList,
    Avatar,
    AddAppForm: AddForm,
    ConfigureAppForm,
    ActionsList,
    PopConfirm,
  },
  data: () => ({
    isInstallModalActive: false,
    isConfigureModalActive: false,
    isActionModalActive: false,
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

      this.isConfigureModalActive = true
      this.configuratedApp = app
    },
    openActionsModal(app: App) {
      this.isActionModalActive = true
      this.configuratedApp = app
    },
    goToMicrofrontend(app: App) {
      if (!app.microfrontend_url) return

      this.$router.push(`/apps/${app.id}/`)
    },
    closeConfigurationModal() {
      this.configuratedApp = null
      this.$nextTick(() => {
        this.isConfigureModalActive = false
      })
    },
    closeActionsModal() {
      this.configuratedApp = null
      this.$nextTick(() => {
        this.isActionModalActive = false
      })
    },

    async installApplication() {
      this.$accessor.startLoading()

      await this.$accessor.apps.add({
        ...this.installForm,
        // ? Only to allow local apps to work on docker
        url: trimSlash(this.installForm.url.replace('localhost', 'host.docker.internal')),
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
        this.$accessor.menuItems.removeNotExistingApps()
        this.$toast.success(this.$t('deleteMessage') as string)
        this.isConfigureModalActive = false
      } else {
        if (!force)
          this.$confirm({
            title: this.$t('deleteForceText') as string,
            okText: this.$t('deleteConfirm') as string,
            okType: 'danger',
            onOk: () => {
              this.uninstallApp(app, true)
            },
          })
        else this.$toast.error(this.$t('deleteFailed') as string)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.app-action {
  display: flex;
  align-items: center;

  &__text {
    white-space: nowrap;
  }

  span {
    margin-right: 8px;
  }
}
</style>

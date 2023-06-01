<template>
  <div class="add-app-form">
    <validated-input
      v-model="form.url"
      rules="required|url"
      :label="$t('form.url').toString()"
      :loading="isLoading"
    />

    <div v-if="isLoading" class="add-app-form__loading">
      <loading-indicator />
    </div>

    <a-alert
      v-else-if="isError && form.url"
      type="error"
      show-icon
      :message="$t('error.no_app').toString()"
      :description="$t('error.no_app_description').toString()"
    />

    <template v-else-if="appInfo && form.url">
      <hr />
      <div class="add-app-form__row">
        <img v-if="appInfo.icon" :src="appInfo.icon" alt="" class="app-icon" />
        <div class="field">
          <div class="field__label">{{ $t('preview.name') }}</div>
          <div class="field__value">
            <b>{{ appInfo.name }}</b>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="field__label">{{ $t('preview.description') }}</div>
        <div class="field__value">{{ appInfo.description }}</div>
      </div>
      <div class="add-app-form__row">
        <div class="field">
          <div class="field__label">{{ $t('preview.version') }}</div>
          <div class="field__value">{{ appInfo.version }}</div>
        </div>
        <div class="field">
          <div class="field__label">{{ $t('preview.api_version') }}</div>
          <div class="field__value">{{ appInfo.api_version }}</div>
        </div>
        <div class="field">
          <div class="field__label">{{ $t('preview.author') }}</div>
          <div class="field__value">{{ appInfo.author }}</div>
        </div>
      </div>

      <validated-input
        v-if="appInfo.licence_required"
        v-model="form.licence_key"
        rules="required"
        :label="$t('form.licence_key').toString()"
      />

      <div class="field">
        <div class="field__label">{{ $t('preview.required_permissions') }}</div>
        <div class="field__value">
          <ul v-if="requiredPermissions.length">
            <li v-for="perm in requiredPermissions" :key="perm.id">
              {{ perm.display_name || perm.name }}

              <info-tooltip v-if="perm.description"> {{ perm.description }} </info-tooltip>
            </li>
          </ul>
          <small v-else>{{ $t('common.none') }}</small>
        </div>
      </div>

      <div class="field">
        <div class="field__label">{{ $t('preview.internal_permissions') }}</div>
        <div class="field__value">
          <div class="field__value">
            <ul v-if="appInfo.internal_permissions.length">
              <li v-for="perm in appInfo.internal_permissions" :key="perm.id" class="permission">
                <a-tooltip>
                  <template #title>
                    {{ $t('preview.should_be_unauthenticated') }}
                  </template>
                  <switch-input
                    :value="isPermUnauthenticated(perm)"
                    @input="(v) => changeIsPermUnauthenticated(perm, v)"
                  >
                    <template #unCheckedChildren> <i class="bx bxs-low-vision"></i> </template>
                    <template #checkedChildren> <i class="bx bx-show"></i> </template>
                  </switch-input>
                </a-tooltip>

                <div class="permission__name">
                  {{ perm.display_name || perm.name }}
                </div>

                <info-tooltip v-if="perm.description"> {{ perm.description }} </info-tooltip>
              </li>
            </ul>
            <small v-else>{{ $t('common.none') }}</small>
          </div>
        </div>
      </div>

      <hr />

      <app-button @click="$emit('submit')">{{ $t('form.install') }}</app-button>
    </template>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "url": "Link do aplikacji",
      "licence_key": "Klucz licencyjny",
      "install": "Zainstaluj"
    },
    "preview": {
      "name": "Nazwa",
      "description": "Opis",
      "version": "Wersja aplikacji",
      "api_version": "Wymagana wersja sklepu",
      "author": "Autor",
      "required_permissions": "Wymagane uprawnienia",
      "internal_permissions": "Wewnętrzne uprawnienia aplikacji",
      "should_be_unauthenticated": "Uprawnienie powinno być nadane niezalogowanym użytkownikom"
    },
    "error": {
      "no_app": "Nie udało się pobrać informacji o aplikacji",
      "no_app_description": "Aplikacja którą próbujesz dodać nie istnieje, albo powoduje błąd. Nie można jej obecnie zainstalować."
    }
  },
  "en": {
    "form": {
      "url": "App URL",
      "licence_key": "Licence key",
      "install": "Install"
    },
    "preview": {
      "name": "Name",
      "description": "Description",
      "version": "App version",
      "api_version": "Required API version",
      "author": "Author",
      "required_permissions": "Required permissions",
      "internal_permissions": "Internal permissions",
      "should_be_unauthenticated": "Permission should be given to unauthenticated users"
    },
    "error": {
      "no_app": "Failed to load app info",
      "no_app_description": "The app you are trying to add does not exist or causes an error. It cannot be installed at the moment."
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import axios from 'axios'
import { debounce } from 'lodash'
import {
  AppInternalPermission,
  AppCreateDto,
  IntegrationInfo,
  PermissionEntry,
} from '@heseya/store-core'

import LoadingIndicator from '@/components/layout/LoadingIndicator.vue'

export default defineComponent({
  components: { LoadingIndicator },
  props: {
    value: {
      type: Object as PropType<AppCreateDto>,
      required: true,
    },
    isValidUrl: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    appInfo: null as IntegrationInfo | null,
    isError: false,
    isLoading: false,
  }),
  computed: {
    form: {
      get(): AppCreateDto {
        return this.value
      },
      set(value: AppCreateDto) {
        this.$emit('input', value)
      },
    },
    requiredPermissions(): PermissionEntry[] {
      return (this.appInfo?.required_permissions || []).map(
        (name) =>
          this.$accessor.roles.permissions.find((perm) => perm.name === name) ||
          ({
            id: `${Math.random()}`,
            name,
            display_name: name,
            assignable: false,
          } as PermissionEntry),
      )
    },
  },
  watch: {
    ['form.url']() {
      this.urlWatcher()
    },
    isValidUrl() {
      this.urlWatcher()
    },
  },
  created() {
    this.$accessor.roles.fetchPermissions()
  },
  methods: {
    urlWatcher() {
      if (this.isValidUrl) this.debouncedFetch()
      this.isError = false
      this.appInfo = null
    },
    debouncedFetch: debounce(function (this: any) {
      this.fetchAppInfo()
    }, 500),
    async fetchAppInfo() {
      if (!this.form.url) return

      try {
        this.isLoading = true
        this.isError = false

        const { data } = await axios.get<IntegrationInfo>(this.form.url)

        this.appInfo = data
        this.form.name = data.name
        this.form.allowed_permissions = data.required_permissions
        this.form.public_app_permissions = data.internal_permissions
          .filter((p) => p.unauthenticated)
          .map((p) => p.name)
      } catch (e) {
        this.isError = true
      }
      this.isLoading = false
    },

    isPermUnauthenticated(perm: AppInternalPermission) {
      return !!this.form.public_app_permissions?.find((p) => p === perm.name) ?? false
    },
    changeIsPermUnauthenticated(perm: AppInternalPermission, value: boolean) {
      if (value) {
        this.form.public_app_permissions?.push(perm.name)
      } else {
        this.form.public_app_permissions = this.form.public_app_permissions?.filter(
          (p) => p !== perm.name,
        )
      }
    },
  },
})
</script>

<style lang="scss">
.add-app-form {
  &__row {
    display: flex;
    align-items: center;
  }

  .field {
    width: 100%;
    margin: 8px 0;

    &__label {
      font-weight: 600;
      font-size: 0.7em;
      line-height: 1em;
      margin-bottom: 6px;
    }

    &__value {
      line-height: 1em;
    }

    b {
      font-size: 1.1em;
    }

    ul {
      padding-left: 0;
      list-style-type: none;

      li {
        &::before {
          content: '';
          display: inline-block;
          width: 5px;
          height: 5px;
          margin-right: 8px;
          background-color: var(--font-color);
        }
      }
    }
  }

  .app-icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  .permission {
    display: flex;
    align-items: center;
    position: relative;

    &__name {
      margin-left: 12px;
    }
  }
}
</style>

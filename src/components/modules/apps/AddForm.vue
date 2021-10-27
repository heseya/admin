<template>
  <div class="add-app-form">
    <validated-input
      v-model="form.url"
      rules="required|url"
      label="Link do aplikacji"
      :loading="isLoading"
    />

    <div v-if="isLoading" class="add-app-form__loading">
      <loading-indicator />
    </div>

    <a-alert
      v-else-if="isError && form.url"
      type="error"
      show-icon
      message="Nie udało się pobrać informacji o aplikacji"
      description="Aplikacja którą próbujesz dodać nie istnieje, albo powoduje błąd. Nie można jej obecnie zainstalować."
    />

    <template v-else-if="appInfo && form.url">
      <hr />
      <div class="add-app-form__row">
        <img v-if="appInfo.icon" :src="appInfo.icon" alt="" class="app-icon" />
        <div class="field">
          <div class="field__label">Nazwa</div>
          <div class="field__value">
            <b>{{ appInfo.name }}</b>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="field__label">Opis</div>
        <div class="field__value">{{ appInfo.description }}</div>
      </div>
      <div class="add-app-form__row">
        <div class="field">
          <div class="field__label">Wersja aplikacji</div>
          <div class="field__value">{{ appInfo.version }}</div>
        </div>
        <div class="field">
          <div class="field__label">Wymagana wersja sklepu</div>
          <div class="field__value">{{ appInfo.api_version }}</div>
        </div>
        <div class="field">
          <div class="field__label">Autor</div>
          <div class="field__value">{{ appInfo.author }}</div>
        </div>
      </div>

      <div class="field">
        <div class="field__label">Wymagane uprawnienia</div>
        <div class="field__value">
          <ul>
            <li v-for="perm in requiredPermissions" :key="perm.id">
              {{ perm.display_name || perm.name }}

              <a-tooltip v-if="perm.description">
                <template slot="title"> {{ perm.description }} </template>
                <i class="bx bxs-info-circle"></i>
              </a-tooltip>
            </li>
          </ul>
          <small v-if="requiredPermissions.length === 0">Brak</small>
        </div>
      </div>

      <div class="field">
        <div class="field__label">Wewnętrzne uprawnienia aplikacji</div>
        <div class="field__value">
          <div class="field__value">
            <ul>
              <li v-for="perm in appInfo.internal_permissions" :key="perm.id">
                {{ perm.display_name || perm.name }}

                <a-tooltip v-if="perm.description">
                  <template slot="title"> {{ perm.description }} </template>
                  <i class="bx bxs-info-circle"></i>
                </a-tooltip>
              </li>
            </ul>
            <small v-if="requiredPermissions.length === 0">Brak</small>
          </div>
        </div>
      </div>

      <hr />

      <app-button @click="$emit('submit')">Zainstaluj</app-button>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { debounce } from 'lodash'

import LoadingIndicator from '@/components/layout/LoadingIndicator.vue'

import { CreateAppDto, IntegrationInfo } from '@/interfaces/App'
import { PermissionObject } from '@/interfaces/Permissions'

export default Vue.extend({
  components: { LoadingIndicator },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<CreateAppDto>,
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
      get(): CreateAppDto {
        return this.value
      },
      set(value: CreateAppDto) {
        this.$emit('input', value)
      },
    },
    requiredPermissions(): PermissionObject[] {
      return (this.appInfo?.required_permissions || [])
        .map((name) => this.$accessor.roles.permissions.find((perm) => perm.name === name))
        .filter((perm) => !!perm) as PermissionObject[]
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
    // @ts-ignore // TODO: fix extended store actions typings
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
      padding-left: 20px;
      list-style-type: square;
    }
  }

  .app-icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }
}
</style>

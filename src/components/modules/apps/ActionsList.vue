<template>
  <div class="app-actions">
    <Loading :active="isLoading" />
    <Empty v-if="actions.length === 0">{{ $t('emptyText') }}</Empty>

    <ListItem v-for="(action, i) in actions" :key="i" no-hover>
      <template #default>{{ action.name }}</template>
      <template #action>
        <icon-button :disabled="!hasPermissions(action)" size="small" @click="runAction(action)">
          <template #icon>
            <i class="bx bx-play-circle"></i>
          </template>
          {{ hasPermissions(action) ? $t('runAction') : $t('noPermission') }}
        </icon-button>
      </template>
    </ListItem>

    <div
      v-if="recentResult"
      class="action-result"
      :class="{ 'action-result--error': isRecentResultError }"
    >
      <p class="action-result__status">{{ $t('result.status') }}: {{ recentResult.status }}</p>
      <VueJsonPretty
        v-if="recentResult.data"
        class="action-result__response"
        :path="'res'"
        :data="recentResult.data"
      />
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "emptyText": "Ta aplikacja nie posiada żadnych akcji",
    "runAction": "Uruchom akcję",
    "noPermission": "Brak uprawnień",
    "result": {
      "status": "Status odpowiedzi"
    }
  },
  "en": {
    "emptyText": "This application has no actions",
    "runAction": "Run action",
    "noPermission": "No permissions",
    "result": {
      "status": "Response status"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { AxiosInstance } from 'axios'
import { App, AppAction } from '@heseya/store-core'
// @ts-ignore
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

import { createApiInstance } from '@/api'

import Loading from '@/components/layout/Loading.vue'
import Empty from '@/components/layout/Empty.vue'
import ListItem from '@/components/layout/ListItem.vue'
import { AxiosResponse } from 'axios'

export default defineComponent({
  components: { VueJsonPretty, Loading, Empty, ListItem },
  props: {
    app: {
      type: Object as PropType<App | null>,
      default: null,
    },
  },
  data: () => ({
    isLoading: false,
    actions: [] as AppAction[],
    recentResult: null as null | AxiosResponse,
    isRecentResultError: false,
  }),
  computed: {
    appApi(): AxiosInstance | null {
      return this.app ? createApiInstance(this.app.url, false) : null
    },
  },
  watch: {
    app() {
      this.fetchAppActions()
    },
  },
  created() {
    this.fetchAppActions()
  },
  methods: {
    async fetchAppActions() {
      if (!this.app || !this.appApi) return

      try {
        this.isLoading = true
        const { data } = await this.appApi.get<AppAction[]>('/actions')
        this.actions = data
      } catch {
        this.actions = []
      }

      this.isLoading = false
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasPermissions(_action: AppAction) {
      // TODO: handle permissions
      return true
    },

    async runAction(action: AppAction) {
      this.isLoading = true
      this.recentResult = null
      if (!this.hasPermissions(action)) return

      try {
        const resp = await this.appApi?.request({
          method: action.method,
          url: action.url,
        })

        this.isRecentResultError = false
        this.recentResult = resp ?? null
      } catch (e: any) {
        this.isRecentResultError = true
        this.recentResult = e.response ?? null
      }
      this.isLoading = false
    },
  },
})
</script>

<style lang="scss">
.app-actions {
  .icon-button__text {
    white-space: nowrap;
  }
}

.action-result {
  border: solid 4px $green-color-500;
  border-radius: 4px;
  margin-top: 16px;

  &__status {
    padding: 4px 8px;
    font-weight: 600;
    margin-bottom: 8px;
    background-color: $green-color-400;
    font-size: 1.1rem;
    color: #fff;
  }

  &__response {
    padding: 4px 16px;
  }

  &--error {
    border-color: $red-color-500;
  }

  &--error &__status {
    background-color: $red-color-500;
  }
}
</style>

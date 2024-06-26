<template>
  <div :key="webhook.id" class="narrower-page">
    <top-nav :title="!isNew ? webhook.name : $t('newTitle').toString()">
      <icon-button v-if="!isNew" @click="toggleEventsModal">
        <template #icon>
          <i class="bx bx-list-ul"></i>
        </template>
        {{ $t('showLogs') }}
      </icon-button>

      <pop-confirm
        v-if="!isNew"
        v-can="$p.Webhooks.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deleteWebhook"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <card>
      <WebhookForm
        :key="webhook.id"
        v-model="editedWebhook"
        :disabled="!$can(isNew ? $p.Webhooks.Edit : $p.Webhooks.Add)"
        @submit="saveWebhook"
      />
    </card>

    <a-modal
      :visible="logsModalVisible"
      width="750px"
      :footer="null"
      :title="$t('logs')"
      @cancel="toggleEventsModal"
    >
      <div class="logs-modal">
        <loading :active="areLogsLoading" />

        <template v-if="logs.length">
          <Log v-for="log in logs" :key="log.id" :data="log" />

          <pagination
            v-if="logsMeta.lastPage > 1"
            class="logs-modal__pagination"
            :length="logsMeta.lastPage"
            :value="logsMeta.currentPage"
            @input="fetchLogs"
          />
        </template>
        <span v-else>{{ $t('noLogs') }}</span>
      </div>
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Nowy webhook",
    "deleteText": "Czy na pewno chcesz usunąć ten webhook?",
    "deletedMessage": "Webhook został usunięty.",
    "createdMessage": "Webhook został zaktualizowany.",
    "updatedMessage": "Webhook został utworzony.",
    "showLogs": "Pokaż logi",
    "logs": "Logi",
    "noLogs": "Brak logów do wyświetlenia"
  },
  "en": {
    "newTitle": "New webhook",
    "deleteText": "Are you sure you want to delete this webhook?",
    "deletedMessage": "Webhook has been deleted.",
    "createdMessage": "Webhook has been created.",
    "updatedMessage": "Webhook has been updated.",
    "showLogs": "Show logs",
    "logs": "Logs",
    "noLogs": "No logs to show"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import {
  HeseyaPaginationMeta,
  WebhookEntry,
  WebhookEntryUpdateDto,
  WebhookEventLog,
} from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import WebhookForm from '@/components/modules/webhooks/Form.vue'
import Pagination from '@/components/cms/Pagination.vue'
import Log from '@/components/modules/webhooks/Log.vue'

import { formatApiNotificationError } from '@/utils/errors'
import Loading from '@/components/layout/Loading.vue'

const CLEAR_FORM: WebhookEntryUpdateDto = {
  url: '',
  events: [],
  name: '',
  secret: '',
  with_issuer: false,
  with_hidden: false,
}

export default defineComponent({
  metaInfo(this: any): any {
    const fallback = this.$t('newTitle') as string
    return {
      title: this.isNew ? fallback : this.webhook?.name || this.webhook?.url || fallback,
    }
  },
  components: {
    TopNav,
    Card,
    WebhookForm,
    PopConfirm,
    Log,
    Pagination,
    Loading,
  },
  data: () => ({
    editedWebhook: cloneDeep(CLEAR_FORM),
    logsModalVisible: false,
    areLogsLoading: false,
  }),
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    webhook(): WebhookEntry {
      return this.$accessor.webhooks.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.webhooks.getError
    },
    logs(): WebhookEventLog[] {
      return this.$accessor.webhooks.logs
    },
    logsMeta(): HeseyaPaginationMeta {
      return this.$accessor.webhooks.logsMeta
    },
  },
  watch: {
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
    webhook() {
      this.editedWebhook = cloneDeep(this.webhook)
    },
  },

  async created() {
    this.$accessor.startLoading()

    await Promise.all([this.$accessor.webhooks.fetchEvents(), this.fetchLogs()])

    if (!this.isNew) await this.$accessor.webhooks.get(this.id)

    this.$accessor.stopLoading()
  },
  methods: {
    async fetchLogs(page = 1) {
      this.areLogsLoading = true
      await this.$accessor.webhooks.fetchLogs({ web_hook_id: this.id, page })
      this.areLogsLoading = false
    },

    async saveWebhook(webhook: WebhookEntry) {
      this.$accessor.startLoading()
      const newWebHook = this.isNew
        ? await this.$accessor.webhooks.add(webhook)
        : await this.$accessor.webhooks.update({ id: this.id, item: webhook })

      if (newWebHook) {
        this.$toast.success(
          this.isNew
            ? (this.$t('createdMessage') as string)
            : (this.$t('updatedMessage') as string),
        )
        if (this.isNew) this.$router.push(`/webhooks/${newWebHook.id}`)
      }
      this.$accessor.stopLoading()
    },
    async deleteWebhook() {
      this.$accessor.startLoading()
      const success = await this.$accessor.webhooks.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('deletedMessage') as string)
        this.$router.push('/webhooks')
      }
      this.$accessor.stopLoading()
    },
    toggleEventsModal() {
      this.logsModalVisible = !this.logsModalVisible
    },
  },
})
</script>

<style lang="scss" scoped>
.logs-modal {
  &__pagination {
    margin-top: 18px;
  }
}
</style>

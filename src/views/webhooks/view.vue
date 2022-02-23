<template>
  <div :key="webhook.id" class="narrower-page">
    <top-nav :title="!isNew ? webhook.name : $t('newTitle')">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Webhooks.Remove"
        :title="$t('deleteText')"
        :ok-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
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
  </div>
</template>

<i18n>
{
  "pl": {
    "newTitle": "Nowy webhook",
    "deleteText": "Czy na pewno chcesz usunąć ten webhook?",
    "deletedMessage": "Webhook został usunięty.",
    "createdMessage": "Webhook został zaktualizowany.",
    "updatedMessage": "Webhook został utworzony."
  },
  "en": {
    "newTitle": "New webhook",
    "deleteText": "Are you sure you want to delete this webhook?",
    "deletedMessage": "Webhook has been deleted.",
    "createdMessage": "Webhook has been created.",
    "updatedMessage": "Webhook has been updated."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'

import { WebHook, WebHookDto } from '@/interfaces/Webhook'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import WebhookForm from '@/components/modules/webhooks/Form.vue'

import { formatApiNotificationError } from '@/utils/errors'

const CLEAR_FORM: WebHookDto = {
  url: '',
  events: [],
  name: '',
  secret: '',
  with_issuer: false,
  with_hidden: false,
}

export default Vue.extend({
  metaInfo(this: any): any {
    return { title: this.webhook?.name || this.webhook?.url || (this.$t('newTitle') as string) }
  },
  components: {
    TopNav,
    Card,
    WebhookForm,
    PopConfirm,
  },
  data: () => ({
    editedWebhook: cloneDeep(CLEAR_FORM),
  }),
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    webhook(): WebHook {
      return this.$accessor.webhooks.getSelected
    },
    error(): any {
      return this.$accessor.webhooks.getError
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

    // @ts-ignore // TODO: fix extended store actions typings
    await this.$accessor.webhooks.fetchEvents()
    if (!this.isNew) await this.$accessor.webhooks.get(this.id)

    this.$accessor.stopLoading()
  },
  methods: {
    async saveWebhook(webhook: WebHook) {
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
  },
})
</script>
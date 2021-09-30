<template>
  <div :key="webhook.id" class="narrower-page">
    <top-nav :title="!isNew ? webhook.name : 'Nowy webhook'">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Webhooks.Remove"
        title="Czy na pewno chcesz usunąć tego webhooka?"
        ok-text="Usuń"
        cancel-text="Anuluj"
        @confirm="deleteWebhook"
      >
        <icon-button type="danger">
          <i slot="icon" class="bx bx-trash"></i>
          Usuń
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
  metaInfo(): any {
    return { title: this.webhook?.name || this.webhook?.url || 'Nowy webhook' }
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
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.webhooks.get(this.id)
      this.$accessor.stopLoading()
    }
  },
  methods: {
    async saveWebhook(webhook: WebHook) {
      this.$accessor.startLoading()
      const success = this.isNew
        ? await this.$accessor.webhooks.add(webhook)
        : await this.$accessor.webhooks.update({ id: this.id, item: webhook })

      if (success) {
        this.$toast.success(
          this.isNew ? 'Webhook został utworzony.' : 'Webhook został zaktualizowany.',
        )
        if (this.isNew) this.$router.push(`/webhooks/${webhook.id}`)
      }
      this.$accessor.stopLoading()
    },
    async deleteWebhook() {
      this.$accessor.startLoading()
      const success = await this.$accessor.webhooks.remove(this.id)
      if (success) {
        this.$toast.success('Webhook został usunięty.')
        this.$router.push('/webhooks')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

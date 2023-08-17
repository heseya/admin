<template>
  <div class="narrower-page">
    <TopNav :title="!isNew ? salesChannel.name : $t('newTitle').toString()">
      <PopConfirm
        v-if="!isNew"
        v-can="$p.SalesChannels.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deleteBanner"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </PopConfirm>
    </TopNav>

    <Card>
      <SalesChannelForm v-model="form" :disabled="isDisabled" @submit="save" />
    </Card>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Nowy kanał sprzedaży",
    "deleteText": "Czy na pewno chcesz usunąć ten kanał sprzedaży?",
    "deletedMessage": "Kanał sprzedaży został usunięty.",
    "createdMessage": "Kanał sprzedaży został utworzony.",
    "updatedMessage": "Kanał sprzedaży został zaktualizowany."
  },
  "en": {
    "newTitle": "New sales channel",
    "deleteText": "Are you sure you want to delete this sales channel?",
    "deletedMessage": "Sales channel has been deleted",
    "createdMessage": "Sales channel has been created",
    "updatedMessage": "Sales channel has been updated"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { SalesChannel, SalesChannelCreateDto, SalesChannelStatus } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SalesChannelForm from '@/components/modules/salesChannel/Form.vue'

import { formatApiNotificationError } from '@/utils/errors'
import Card from '@/components/layout/Card.vue'

const CLEAN_FORM: SalesChannelCreateDto = {
  slug: '',
  status: SalesChannelStatus.Active,
  country_block_list: true,
  country_codes: [],
  default_currency_id: '',
  default_language_id: '',
  vat_rate: '0',
  translations: {},
}

export default defineComponent({
  metaInfo(this: any): any {
    const fallback = this.$t('newTitle') as string
    return {
      title: this.isNew ? fallback : this.salesChannel?.name || fallback,
    }
  },
  components: {
    TopNav,
    PopConfirm,
    SalesChannelForm,
    Card,
  },
  data: () => ({
    form: cloneDeep(CLEAN_FORM),
    selected: null as SalesChannel | null,
  }),
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    salesChannel(): SalesChannel {
      return this.$accessor.salesChannels.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.salesChannels.getError
    },
    isLoading(): boolean {
      return this.$accessor.salesChannels.isLoading
    },
    isDisabled(): boolean {
      return this.isNew
        ? !this.$can(this.$p.SalesChannels.Add)
        : !this.$can(this.$p.SalesChannels.Edit)
    },
  },
  watch: {
    salesChannel(salesChannel: SalesChannel) {
      if (!this.isNew) {
        this.form = cloneDeep({
          ...salesChannel,
          default_currency_id: salesChannel.default_currency?.code,
          default_language_id: salesChannel.default_language?.id,
          translations: salesChannel.translations || {},
        })
        this.selected = salesChannel
      }
    },
    error(error: any) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.salesChannels.get(this.id)
      this.$accessor.stopLoading()
    }
  },
  methods: {
    async save() {
      this.$accessor.startLoading()
      const successMessage = this.isNew
        ? (this.$t('createdMessage') as string)
        : (this.$t('updatedMessage') as string)

      const form: SalesChannelCreateDto = {
        ...this.form,
      }

      const salesChannel = this.isNew
        ? await this.$accessor.salesChannels.add(form)
        : await this.$accessor.salesChannels.update({ id: this.id, item: form })

      if (salesChannel) {
        this.$toast.success(successMessage)
      }

      if (salesChannel && salesChannel.id !== this.id)
        this.$router.push(`/settings/sales-channels/${salesChannel.id}`)

      this.$accessor.stopLoading()
    },

    async deleteBanner() {
      this.$accessor.startLoading()
      const success = await this.$accessor.salesChannels.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('deletedMessage') as string)
        this.$router.push('/settings/sales-channels')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

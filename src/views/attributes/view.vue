<template>
  <div :key="attribute.id" class="narrower-page">
    <top-nav :title="!isNew ? attribute.name : $t('newTitle')">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Attributes.Remove"
        :title="$t('deleteText')"
        :ok-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
        @confirm="deleteAttribute"
      >
        <icon-button type="danger" data-cy="delete-btn">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="attribute">
      <card>
        <AttributeForm
          :key="attribute.id"
          :attribute="isNew ? {} : attribute"
          :disabled="!$can(isNew ? $p.Attributes.Edit : $p.Attributes.Add)"
          @submit="onSubmit"
        />
      </card>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Nowa cecha",
    "deleteText": "Czy na pewno chcesz usunąć tą cechę?",
    "deletedMessage": "Cecha została usunięty"
  },
  "en": {
    "newTitle": "New attribute",
    "deleteText": "Are you sure you want to delete this attribute?",
    "deletedMessage": "Attribute has been deleted"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Attribute } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import AttributeForm from '@/components/modules/attributes/Form.vue'

import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.attribute?.name || (this.$t('newTitle') as string) }
  },
  components: {
    TopNav,
    Card,
    AttributeForm,
    PopConfirm,
  },
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    attribute(): Attribute {
      return this.$accessor.attributes.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.attributes.getError
    },
  },
  watch: {
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.attributes.get(this.id)
      this.$accessor.stopLoading()
    }
  },
  methods: {
    async onSubmit({ id }: Attribute) {
      if (this.isNew) this.$router.push(`/settings/attributes/${id}`)
    },
    async deleteAttribute() {
      this.$accessor.startLoading()
      const success = await this.$accessor.attributes.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('deletedMessage') as string)
        this.$router.push('/settings/attributes')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss"></style>

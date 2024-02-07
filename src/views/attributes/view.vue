<template>
  <div :key="attribute ? attribute.id : 'new'" class="narrower-page">
    <top-nav :title="!isNew && attribute ? attribute.name : $t('newTitle').toString()">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Attributes.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
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
          :key="attribute ? attribute.id : 'new'"
          :attribute="isNew ? undefined : attribute"
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
    "newTitle": "Nowy atrybut",
    "deleteText": "Czy na pewno chcesz usunąć ten atrybut?",
    "deletedMessage": "Atrybut został usunięty"
  },
  "en": {
    "newTitle": "New attribute",
    "deleteText": "Are you sure you want to delete this attribute?",
    "deletedMessage": "Attribute has been deleted"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Attribute } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import AttributeForm from '@/components/modules/attributes/Form.vue'

import { formatApiNotificationError } from '@/utils/errors'

export default defineComponent({
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
    attribute(): Attribute | undefined {
      return this.$accessor.attributes.getSelected || undefined
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

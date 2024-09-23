<template>
  <div :key="schema.id" class="narrower-page">
    <top-nav :title="!isNew ? schema.name : $t('newTitle')">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Schemas.Remove"
        :title="$t('deleteText')"
        :ok-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
        @confirm="deleteSchema"
      >
        <icon-button type="danger" data-cy="delete-btn">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div v-if="editedSchema.id" class="schema">
      <card>
        <SchemaForm
          :key="schema.id"
          :schema="editedSchema"
          :disabled="!$can(isNew ? $p.Products.Edit : $p.Products.Add)"
          @submit="onSubmit"
        />
      </card>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Nowy schemat",
    "deleteText": "Czy na pewno chcesz usunąć ten schemat?",
    "deletedMessage": "Schemat został usunięty"
  },
  "en": {
    "newTitle": "New schema",
    "deleteText": "Are you sure you want to delete this schema?",
    "deletedMessage": "Schema has been deleted"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { Schema } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SchemaForm from '@/components/modules/schemas/Form.vue'

import { formatApiNotificationError } from '@/utils/errors'

export default defineComponent({
  metaInfo(this: any): any {
    const fallback = this.$t('newTitle') as string
    return {
      title: this.isNew ? fallback : this.schema?.name || fallback,
    }
  },
  components: {
    TopNav,
    Card,
    SchemaForm,
    PopConfirm,
  },
  data: () => ({
    editedSchema: {} as Schema,
  }),
  computed: {
    id(): string {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    schema(): Schema {
      return this.$accessor.schemas.getSelected ?? ({} as any)
    },
    error(): any {
      return this.$accessor.schemas.getError
    },
  },
  watch: {
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
    schema() {
      if (!this.schema.id) return
      this.editedSchema = cloneDeep(this.schema)
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.schemas.get(this.id)
      this.$accessor.stopLoading()
    }
  },
  methods: {
    async onSubmit(schema: Schema) {
      if (this.isNew) this.$router.push(`/schemas/${schema.id}`)
    },
    async deleteSchema() {
      this.$accessor.startLoading()
      const success = await this.$accessor.schemas.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('deletedMessage') as string)
        this.$router.push('/schemas')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss">
.schema__info {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 30px 30px 20px;
  row-gap: 20px;
  margin-top: 15px;

  input {
    width: 100%;
  }
}

@media ($viewport-11) {
  .schema__info {
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 20px;
    grid-template-rows: 1fr;
    row-gap: 0;
  }
}
</style>

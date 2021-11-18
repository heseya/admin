<template>
  <div :key="schema.id" class="narrower-page">
    <top-nav :title="!isNew ? schema.name : 'Nowy schemat'">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Schemas.Remove"
        title="Czy na pewno chcesz usunąć ten schemat?"
        ok-text="Usuń"
        cancel-text="Anuluj"
        @confirm="deleteSchema"
      >
        <icon-button type="danger" data-cy="delete-btn">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          Usuń
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="schema">
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

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'

import { Schema } from '@/interfaces/Schema'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SchemaForm from '@/components/modules/schemas/Form.vue'

import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  metaInfo(): any {
    return { title: this.schema?.name || 'Nowy schemat' }
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
      return this.$accessor.schemas.getSelected
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
        this.$toast.success('Schemat został usunięty.')
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

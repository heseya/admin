<template>
  <div>
    <top-nav :title="!isNew ? schema.name : 'Nowy schemat'">
      <pop-confirm
        v-if="!isNew"
        title="Czy na pewno chcesz usunąć ten schemat?"
        okText="Usuń"
        cancelText="Anuluj"
        @confirm="deleteSchema"
        v-slot="{ open }"
      >
        <vs-button dark icon @click="open">
          <i class="bx bx-trash"></i>
        </vs-button>
      </pop-confirm>
    </top-nav>

    <div class="schema">
      <card>
        <SchemaForm :key="schema.id" :schema="schema" @submit="saveSchema" />
      </card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'

import { Schema } from '@/interfaces/Schema'

import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SchemaForm from '@/components/schema/Form.vue'
import { formatApiError } from '@/utils/errors'

export default Vue.extend({
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
      return this.$store.getters['schemas/getSelected']
    },
    error(): any {
      return this.$store.getters['schemas/getError']
    },
  },
  watch: {
    error(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
      }
    },
    schema() {
      this.editedSchema = cloneDeep(this.schema)
    },
  },
  methods: {
    async saveSchema() {
      this.$accessor.startLoading()
      await this.$accessor.schemas.update({ id: this.schema.id, item: this.schema })
      this.$accessor.stopLoading()
    },
    async deleteSchema() {
      this.$accessor.startLoading()
      const success = await this.$store.dispatch('schemas/remove', this.id)
      if (success) {
        this.$vs.notification({
          color: 'success',
          title: 'Schemat został usunięty.',
        })
        this.$router.push('/schemas')
      }
      this.$accessor.stopLoading()
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$store.dispatch('schemas/get', this.id)
      this.$accessor.stopLoading()
    }
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

  .vs-select-content {
    max-width: none;
  }
}

@media (min-width: $break) {
  .schema__info {
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 20px;
    grid-template-rows: 1fr;
    row-gap: 0;
  }
}
</style>

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
        <SchemaForm @submit="save" :schema="schema" />
      </card>
    </div>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import PopConfirm from '@/components/PopConfirm.vue'
import SchemaForm from '@/components/schema/Form.vue'
import { formatApiError } from '@/utils/errors'

export default {
  components: {
    TopNav,
    Card,
    SchemaForm,
    PopConfirm,
  },
  data() {
    return {}
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    isNew() {
      return this.id === 'create'
    },
    schema() {
      return this.$store.getters['schemas/getSelected']
    },
    error() {
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
  },
  methods: {
    save(schema) {
      if (!this.schema.id) {
        this.$router.push(`/schemas/${schema.id}`)
      }
    },
    async deleteSchema() {
      const loading = this.$vs.loading({ color: '#000' })
      const success = await this.$store.dispatch('schemas/remove', this.id)
      if (success) {
        this.$vs.notification({
          color: 'success',
          title: 'Schemat został usunięty.',
        })
        this.$router.push('/schemas')
      }
      loading.close()
    },
  },
  async created() {
    if (!this.isNew) {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('schemas/get', this.id)
      loading.close()
    }
  },
}
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

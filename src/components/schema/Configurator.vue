<template>
  <div class="configurator">
    <div class="configurator__head">
      <div class="configurator__title">Schematy</div>
      <vs-button dark icon @click="isModalActive = true"><i class="bx bx-plus"></i></vs-button>
    </div>
    <empty v-if="value.length === 0">Ten produkt nie ma jeszcze żadnego schematu</empty>
    <list class="configurator__schemas">
      <list-item class="configurator__schema" v-for="schema in value" :key="schema.id" no-hover>
        {{ schema.name }}
        <small>{{ schema.description }}</small>
        <template #action>
          <div class="flex">
            <vs-button dark icon @click="editSchema(schema)"><i class="bx bx-edit"></i></vs-button>
            <vs-button danger icon @click="removeSchema(schema.id)">
              <i class="bx bx-trash"></i>
            </vs-button>
          </div>
        </template>
      </list-item>
    </list>

    <vs-dialog width="1000px" not-center v-model="isFormModalActive">
      <template #header>
        <h4 style="margin-bottom: 0">{{ editedSchema.id ? 'Edycja' : 'Dodawanie' }} schematu</h4>
      </template>
      <modal-form>
        <SchemaForm :schema="editedSchema" @submit="updateSchema" />
      </modal-form>
    </vs-dialog>

    <vs-dialog width="800px" not-center v-model="isModalActive">
      <template #header>
        <h4 class="flex schema-selector-title">
          Wybierz istniejący schemat lub
          <vs-button
            transparent
            @click="
              isModalActive = false
              isFormModalActive = true
            "
          >
            <i class="bx bx-plus"></i> Utwórz nowy
          </vs-button>
        </h4>
      </template>
      <modal-form>
        <Selector @select="addSchema" type="schemas" :existing="value" />
      </modal-form>
    </vs-dialog>
  </div>
</template>

<script>
import List from '@/components/List.vue'
import ListItem from '@/components/ListItem.vue'
import Empty from '@/components/Empty.vue'
import ModalForm from '@/components/ModalForm.vue'
import SchemaForm from '@/components/schema/Form.vue'
import Selector from '@/components/Selector.vue'

import { SchemaTypeLabel } from '@/interfaces/SchemaType'

export default {
  name: 'SchemaConfigurator',
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    SchemaTypeLabel: Object.freeze(SchemaTypeLabel),
    isModalActive: false,
    isFormModalActive: false,
    editedSchema: {},
  }),
  watch: {
    isFormModalActive() {
      if (!this.isFormModalActive) {
        this.editedSchema = {}
      }
    },
  },
  methods: {
    editSchema(schema) {
      this.editedSchema = schema
      this.isFormModalActive = true
    },
    removeSchema(schemaId) {
      this.$emit(
        'input',
        this.value.filter((s) => s.id !== schemaId),
      )
    },
    addSchema(schema) {
      this.$emit('input', [...this.value, schema])
    },
    updateSchema(schema) {
      this.editedSchema = {}
      this.isFormModalActive = false

      if (this.value.find(({ id }) => id === schema.id)) {
        this.$emit(
          'input',
          this.value.map((s) => (s.id === schema.id ? schema : s)),
        )
      } else {
        this.addSchema(schema)
      }
    },
  },
  components: {
    List,
    ListItem,
    Empty,
    ModalForm,
    SchemaForm,
    Selector,
  },
}
</script>
<style lang="scss" scoped>
.configurator {
  &__head {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-size: 1.3em;
    font-family: $font-sec;
  }

  &__schemas {
    padding: 0;
  }
}

.schema-selector-title {
  display: flex;
  // justify-content: center;
  align-items: center;
  margin-top: 0;
  margin-bottom: 0;

  .vs-button {
    font-weight: 700;
    // font-size: 1em;
  }
}
</style>

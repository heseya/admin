<template>
  <div class="configurator">
    <div class="configurator__head">
      <div class="configurator__title">Schematy</div>
      <vs-button v-if="!disabled" dark icon @click="isModalActive = true">
        <i class="bx bx-plus"></i>
      </vs-button>
    </div>
    <empty v-if="schemas.length === 0">Ten produkt nie ma jeszcze żadnego schematu</empty>
    <list class="configurator__schemas">
      <draggable v-model="schemas" :disabled="disabled">
        <list-item
          v-for="schema in value"
          :key="schema.id"
          class="configurator__schema"
          :class="{ [`configurator__schema--dep`]: schema.auto_dependecy }"
          :title="schema.auto_dependecy ? 'Schemat jest automatyczny - nie możesz go usunąć' : ''"
          no-hover
          :hidden="schema.hidden"
        >
          <i v-if="schema.auto_dependecy" class="bx bx-network-chart"></i>
          {{ schema.name }}
          <small class="optional">{{ !schema.required ? '(opcjonalny)' : '' }}</small>
          <small>{{ schema.description }}</small>
          <template #action>
            <div class="flex">
              <vs-button dark icon @click="editSchema(schema)">
                <i class="bx bx-edit"></i>
              </vs-button>
              <vs-button
                v-if="!disabled"
                danger
                icon
                class="schema-delete"
                @click="removeSchema(schema.id)"
              >
                <i class="bx bx-trash"></i>
              </vs-button>
            </div>
          </template>
        </list-item>
      </draggable>
    </list>

    <vs-dialog v-model="isFormModalActive" width="1000px" not-center>
      <template #header>
        <h4 style="margin-bottom: 0">{{ editedSchema.id ? 'Edycja schematu' : 'Nowy schemat' }}</h4>
      </template>
      <modal-form v-if="isFormModalActive">
        <SchemaForm
          :schema="editedSchema"
          :current-product-schemas="value"
          :disabled="disabled"
          @submit="updateSchema"
        />
      </modal-form>
    </vs-dialog>

    <vs-dialog v-model="isModalActive" width="800px" not-center>
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
        <Selector type="schemas" :existing="value" @select="addSchema" />
      </modal-form>
    </vs-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'

import List from '@/components/layout/List.vue'
import ListItem from '@/components/layout/ListItem.vue'
import Empty from '@/components/layout/Empty.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import SchemaForm from '@/components/modules/schemas/Form.vue'
import Selector from '@/components/Selector.vue'

import { SchemaTypeLabel } from '@/consts/schemaTypeLabels'
import { Schema } from '@/interfaces/Schema'
import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
  name: 'SchemaConfigurator',
  components: {
    List,
    ListItem,
    Empty,
    ModalForm,
    SchemaForm,
    Selector,
    Draggable,
  },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<Schema[]>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    SchemaTypeLabel: Object.freeze(SchemaTypeLabel),
    isModalActive: false,
    isFormModalActive: false,
    editedSchema: {} as Schema,
  }),
  computed: {
    schemas: {
      get(): Schema[] {
        return this.value
      },
      set(val: Schema[]) {
        this.$emit('input', val)
      },
    },
  },
  watch: {
    isFormModalActive() {
      if (!this.isFormModalActive) {
        this.editedSchema = {} as Schema
      }
    },
  },
  methods: {
    editSchema(schema: Schema) {
      this.editedSchema = schema
      this.isFormModalActive = true
    },
    removeSchema(schemaId: UUID) {
      this.$emit(
        'input',
        this.value.filter((s) => s.id !== schemaId),
      )
    },
    addSchema(schema: Schema) {
      this.$emit('input', [...this.value, schema])
    },
    updateSchema(schema: Schema) {
      this.editedSchema = {} as Schema
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
})
</script>
<style lang="scss" scoped>
.configurator {
  &__head {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-size: 1.3em;
    font-weight: 600;
  }

  &__schemas {
    padding: 0;
  }

  &__schema {
    &--dep {
      .schema-delete {
        display: none;
      }
    }
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

.optional {
  display: inline;
}
</style>

<template>
  <div class="configurator">
    <div class="configurator__head">
      <div class="configurator__title">{{ $t('title') }}</div>
      <icon-button v-if="!disabled" @click="isModalActive = true">
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addSchema') }}
      </icon-button>
    </div>
    <empty v-if="schemas.length === 0">{{ $t('noSchemaInProduct') }}</empty>
    <list class="configurator__schemas">
      <draggable v-model="schemas" :disabled="disabled">
        <list-item
          v-for="schema in value"
          :key="schema.id"
          class="configurator__schema"
          no-hover
          :hidden="schema.hidden"
        >
          {{ schema.name }}
          <small class="optional">{{ !schema.required ? `(${$t('optional')})` : '' }}</small>
          <small>{{ schema.description }}</small>
          <template #action>
            <div class="flex">
              <icon-button @click="editSchema(schema)">
                <template #icon>
                  <i class="bx bx-edit"></i>
                </template>
              </icon-button>
              <icon-button
                v-if="!disabled"
                type="danger"
                class="schema-delete"
                @click="removeSchema(schema.id)"
              >
                <template #icon>
                  <i class="bx bx-trash"></i>
                </template>
              </icon-button>
            </div>
          </template>
        </list-item>
      </draggable>
    </list>

    <a-modal
      v-model="isFormModalActive"
      width="1000px"
      :footer="null"
      :title="editedSchema.id ? $t('editTitle') : $t('newTitle')"
    >
      <modal-form v-if="isFormModalActive">
        <SchemaForm
          :schema="editedSchema"
          :current-product-schemas="value"
          :disabled="disabled"
          @submit="updateSchema"
        />
      </modal-form>
    </a-modal>

    <a-modal v-model="isModalActive" width="800px" :footer="null">
      <template #title>
        <h4 class="flex schema-selector-title">
          <span>{{ $t('chooseExisting') }}</span>
          <icon-button
            reversed
            size="small"
            @click="
              isModalActive = false
              isFormModalActive = true
            "
          >
            <template #icon> <i class="bx bx-plus"></i> </template> {{ $t('createNew') }}
          </icon-button>
        </h4>
      </template>
      <modal-form v-if="isModalActive">
        <Selector type="schemas" :existing="value" @select="addSchema" />
      </modal-form>
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Schematy produktu",
    "addSchema": "Dodaj schemat",
    "noSchemaInProduct": "Ten produkt nie ma jeszcze żadnego schematu",
    "optional": "opcjonalny",
    "editTitle": "Edycja schematu",
    "newTitle": "Nowy schemat",
    "chooseExisting": "Wybierz istniejący schemat lub",
    "createNew": "utwórz nowy"
  },
  "en": {
    "title": "Product schemas",
    "addSchema": "Add schema",
    "noSchemaInProduct": "This product has no schemas yet",
    "optional": "optional",
    "editTitle": "Edit schema",
    "newTitle": "New schema",
    "chooseExisting": "Choose existing schema or",
    "createNew": "create new"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Draggable from 'vuedraggable'
import { Schema } from '@heseya/store-core'

import List from '@/components/layout/List.vue'
import ListItem from '@/components/layout/ListItem.vue'
import Empty from '@/components/layout/Empty.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import SchemaForm from '@/components/modules/schemas/Form.vue'
import Selector from '@/components/Selector.vue'

import { UUID } from '@/interfaces/UUID'

export default defineComponent({
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
      type: Array as PropType<Schema[]>,
      required: true,
    },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
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
    font-size: 1.1em;
    font-weight: 600;
  }

  &__schemas {
    padding: 0;
  }

  &__schema {
  }
}

.schema-selector-title {
  display: flex;
  column-gap: 8px;
  align-items: center;
  justify-content: space-between;
  margin-top: 0;
  margin-bottom: 0;
}

.optional {
  display: inline;
}
</style>

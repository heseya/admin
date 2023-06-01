<template>
  <modal-form class="metadata-form">
    <icon-button @click="addField">
      {{ $t('add') }} <template #icon> <i class="bx bx-plus"></i> </template>
    </icon-button>

    <div
      v-for="(meta, i) in metadataList"
      :key="i"
      class="metadata-form__row"
      :class="{ 'metadata-form__row--deleted': isDeleted(meta) }"
    >
      <validated-input
        v-model="meta.key"
        :label="$t('form.key').toString()"
        name="key"
        :disabled="isDeleted(meta) || meta.wasSaved"
        rules="required|metadata-name"
      />

      <app-select
        :value="meta.type"
        :label="$t('form.type').toString()"
        :disabled="isDeleted(meta)"
        @input="(t) => changeMetaType(meta, t)"
      >
        <a-select-option
          v-for="valueType in Object.values(MetadataType)"
          :key="valueType"
          :value="valueType"
          :disabled="valueType === MetadataType.Deleted"
          :label="$t(`form.types.${valueType}`)"
        >
          {{ $t(`form.types.${valueType}`) }}
        </a-select-option>
      </app-select>

      <app-select
        v-if="meta.type === MetadataType.Boolean"
        :value="meta.value ? 1 : 0"
        :label="$t('form.value').toString()"
        :disabled="isDeleted(meta)"
        @input="(v) => (meta.value = !!v)"
      >
        <a-select-option :value="1" :label="$t('common.true').toString()">
          {{ $t('common.true') }}
        </a-select-option>
        <a-select-option :value="0" :label="$t('common.false').toString()">
          {{ $t('common.false') }}
        </a-select-option>
      </app-select>
      <validated-input
        v-else
        v-model="meta.value"
        :type="meta.type === MetadataType.Number ? 'number' : 'text'"
        :label="$t('form.value')"
        name="value"
        :disabled="isDeleted(meta)"
        :placeholder="isDeleted(meta) ? $t('deletedPlaceholder') : ''"
      />

      <icon-button v-if="!isDeleted(meta)" type="danger" @click="removeField(meta)">
        <template #icon>
          <i class="bx bx-trash"></i>
        </template>
      </icon-button>
      <icon-button v-else @click="restoreField(meta)">
        <template #icon>
          <i class="bx bx-reset"></i>
        </template>
      </icon-button>
    </div>

    <validation-provider v-slot="{ errors }" class="metadata-form__error" rules="block-if-error">
      <input v-model="areKeysDuplicated" name="is-duplicated-error" type="hidden" />
      <a-alert v-if="errors.length" type="error" show-icon :message="$t('error_title')" />
    </validation-provider>

    <empty v-if="metadataList.length === 0" class="metadata-form__empty">
      {{ $t('empty') }}
    </empty>
  </modal-form>
</template>

<i18n lang="json">
{
  "en": {
    "form": {
      "key": "Key",
      "value": "Value",
      "type": "Type",
      "types": {
        "string": "String",
        "number": "Number",
        "boolean": "Boolean",
        "object": "Deleted"
      }
    },
    "add": "Add metadata",
    "deletedPlaceholder": "-- deleted --",
    "empty": "No metadata found",
    "error_title": "There cannot be any duplicated keys"
  },
  "pl": {
    "form": {
      "key": "Klucz",
      "value": "Wartość",
      "type": "Typ",
      "types": {
        "string": "Ciąg znaków",
        "number": "Liczba",
        "boolean": "Prawda/Fałsz",
        "object": "Usunięty"
      }
    },
    "add": "Dodaj metadane",
    "deletedPlaceholder": "-- usunięty --",
    "empty": "Nie znaleziono metadanych",
    "error_title": "Nie można dodać metadanych o takim samym kluczu"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationProvider } from 'vee-validate'
import { cloneDeep, isEqual } from 'lodash'
import { MetadataUpdateDto } from '@heseya/store-core'

import ModalForm from '@/components/form/ModalForm.vue'
import Empty from '@/components/layout/Empty.vue'
import { GeneratedStoreModulesKeys } from '@/store'

enum MetadataType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Deleted = 'object',
}

interface MetadataObject {
  key: string
  type: MetadataType
  wasSaved: boolean
  value: string | number | boolean | null | undefined
}

export default defineComponent({
  components: { ModalForm, Empty, ValidationProvider },
  props: {
    originalMetadata: {
      type: Object as PropType<MetadataUpdateDto>,
      default: () => ({}),
    },
    disabled: { type: Boolean, default: false },
    type: { type: String as PropType<'default' | 'private' | 'personal'>, default: 'default' },
    model: {
      type: String as PropType<GeneratedStoreModulesKeys | 'auth'>,
      required: true,
    },
  },

  data: () => ({
    metadataList: [] as MetadataObject[],
  }),

  computed: {
    mergedMetadata(): MetadataUpdateDto {
      return this.metadataList.reduce(
        (acc, { key, type, value }) => ({
          ...acc,
          [key]: type === MetadataType.Number ? parseFloat(value as string) : value,
        }),
        {} as MetadataUpdateDto,
      )
    },
    MetadataType(): typeof MetadataType {
      return MetadataType
    },

    areKeysDuplicated(): boolean {
      const keys = this.metadataList.map(({ key }) => key)
      return keys.length !== new Set(keys).size
    },
  },

  watch: {
    originalMetadata(meta: MetadataUpdateDto) {
      const parsed = this.parseMetadata(meta)
      if (!isEqual(this.metadataList, parsed)) this.metadataList = cloneDeep(parsed)
    },
  },

  beforeMount() {
    this.metadataList = this.parseMetadata(this.originalMetadata)
  },

  methods: {
    parseMetadataKey(key: string, value: MetadataObject['value']): MetadataObject {
      return {
        key,
        type: typeof value as MetadataType,
        wasSaved: key in this.originalMetadata,
        value,
      }
    },
    parseMetadata(meta: MetadataUpdateDto): MetadataObject[] {
      return Object.entries(meta).map(([key, value]) => this.parseMetadataKey(key, value))
    },

    isDeleted(meta: MetadataObject): boolean {
      return meta.type === MetadataType.Deleted
    },

    changeMetaType(meta: MetadataObject, type: MetadataType) {
      meta.type = type
      if (type === MetadataType.String) meta.value = meta.value?.toString() || ''
      if (type === MetadataType.Number) meta.value = parseFloat(meta.value?.toString() || '0') || 0
      if (type === MetadataType.Boolean) meta.value = false
    },

    addField() {
      this.metadataList = [
        ...this.metadataList,
        { key: '', type: MetadataType.String, value: '', wasSaved: false },
      ]
    },

    removeField(meta: MetadataObject) {
      // finding by reference is intended
      const index = this.metadataList.indexOf(meta)
      if (meta.wasSaved)
        this.metadataList = [
          ...this.metadataList.slice(0, index),
          { ...meta, type: MetadataType.Deleted, value: null },
          ...this.metadataList.slice(index + 1),
        ]
      else {
        this.metadataList = [
          ...this.metadataList.slice(0, index),
          ...this.metadataList.slice(index + 1),
        ]
      }
    },

    restoreField(meta: MetadataObject) {
      // finding by reference is intended
      const index = this.metadataList.indexOf(meta)
      this.metadataList = [
        ...this.metadataList.slice(0, index),
        this.parseMetadataKey(meta.key, this.originalMetadata[meta.key] || ''),
        ...this.metadataList.slice(index + 1),
      ]
    },

    saveMetadata(modelId: string) {
      return this.$accessor[this.model].updateMetadata({
        id: modelId,
        metadata: this.mergedMetadata,
        type: this.type,
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.metadata-form {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;

  &__row {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 0.5fr 1fr auto;
    align-items: flex-start;
    grid-gap: 8px;

    :deep(.icon-button) {
      margin-top: 18px;
    }
  }

  &__error {
    width: 100%;
  }

  &__empty {
    width: 100%;
  }
}
</style>

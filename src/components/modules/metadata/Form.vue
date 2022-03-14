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
        :label="$t('form.key')"
        name="key"
        :disabled="isDeleted(meta) || wasPreviouslySaved(meta.key)"
        rules="required"
      />

      <app-select
        :value="meta.type"
        :label="$t('form.type')"
        :disabled="isDeleted(meta)"
        @input="(type) => changeMetaType(meta, type)"
      >
        <a-select-option
          v-for="type in Object.values(MetadataType)"
          :key="type"
          :value="type"
          :disabled="type === MetadataType.Deleted"
          :label="$t(`form.types.${type}`)"
        >
          {{ $t(`form.types.${type}`) }}
        </a-select-option>
      </app-select>

      <app-select
        v-if="meta.type === MetadataType.Boolean"
        :value="meta.value ? 1 : 0"
        :label="$t('form.value')"
        :disabled="isDeleted(meta)"
        @input="(v) => (meta.value = !!v)"
      >
        <a-select-option :value="1" :label="$t('common.true')">
          {{ $t('common.true') }}
        </a-select-option>
        <a-select-option :value="0" :label="$t('common.false')">
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

      <icon-button v-if="!isDeleted(meta)" type="danger" @click="removeField(meta.key)">
        <template #icon>
          <i class="bx bx-trash"></i>
        </template>
      </icon-button>
      <icon-button v-else @click="restoreField(meta.key)">
        <template #icon>
          <i class="bx bx-reset"></i>
        </template>
      </icon-button>
    </div>

    <empty v-if="metadataList.length === 0" class="metadata-form__empty">
      {{ $t('empty') }}
    </empty>
  </modal-form>
</template>

<i18n>
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
    "empty": "No metadata found"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import isEqual from 'lodash/isEqual'
import { MetadataDto } from '@/interfaces/Metadata'
import ModalForm from '@/components/form/ModalForm.vue'
import Empty from '@/components/layout/Empty.vue'
import { GeneratedStoreModulesKeys } from '@/store'
import { cloneDeep } from 'lodash'

enum MetadataType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Deleted = 'object',
}

interface MetadataObject {
  key: string
  type: MetadataType
  value: string | number | boolean | null
}

export default Vue.extend({
  components: { ModalForm, Empty },
  props: {
    originalMetadata: {
      type: Object,
      default: () => ({}),
    } as Vue.PropOptions<MetadataDto>,
    disabled: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    model: {
      type: String,
      required: true,
    } as Vue.PropOptions<GeneratedStoreModulesKeys>,
  },

  data: () => ({
    metadataList: [] as MetadataObject[],
  }),

  computed: {
    mergedMetadata(): MetadataDto {
      return this.metadataList.reduce(
        (acc, { key, type, value }) => ({
          ...acc,
          [key]: type === MetadataType.Number ? parseFloat(value as string) : value,
        }),
        {} as MetadataDto,
      )
    },
    MetadataType(): typeof MetadataType {
      return MetadataType
    },
  },

  watch: {
    originalMetadata(meta: MetadataDto) {
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
        value,
      }
    },
    parseMetadata(meta: MetadataDto): MetadataObject[] {
      return Object.entries(meta).map(([key, value]) => this.parseMetadataKey(key, value))
    },

    isDeleted(meta: MetadataObject): boolean {
      return meta.type === MetadataType.Deleted
    },
    wasPreviouslySaved(key: string): boolean {
      return key in this.originalMetadata
    },

    changeMetaType(meta: MetadataObject, type: MetadataType) {
      meta.type = type
      if (type === MetadataType.String) meta.value = meta.value?.toString() || ''
      if (type === MetadataType.Number) meta.value = parseFloat(meta.value?.toString() || '0') || 0
      if (type === MetadataType.Boolean) meta.value = false
    },

    addField() {
      this.metadataList = [...this.metadataList, { key: '', type: MetadataType.String, value: '' }]
    },

    removeField(key: string) {
      if (this.wasPreviouslySaved(key))
        this.metadataList = this.metadataList.map((meta) =>
          meta.key === key ? { ...meta, type: MetadataType.Deleted, value: null } : meta,
        )
      else this.metadataList = this.metadataList.filter((meta) => meta.key !== key)
    },

    restoreField(key: string) {
      this.metadataList = this.metadataList.map((meta) =>
        meta.key === key ? this.parseMetadataKey(key, this.originalMetadata[key] || '') : meta,
      )
    },

    async saveMetadata(modelId: string) {
      await this.$accessor[this.model].updateMetadata({
        id: modelId,
        metadata: this.mergedMetadata,
        public: !this.isPrivate,
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
    display: flex;
    width: 100%;
    align-items: center;

    > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &__empty {
    width: 100%;
  }
}
</style>

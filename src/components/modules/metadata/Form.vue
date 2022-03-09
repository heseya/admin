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
        :disabled="isDeleted(meta)"
        rules="required"
      />
      <validated-input
        v-model="meta.value"
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
      "type": "Type"
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
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<MetadataDto>,
    disabled: { type: Boolean, default: false },
    private: { type: Boolean, default: false },
  },
  data: () => ({
    metadataList: [] as MetadataObject[],
  }),
  computed: {
    metadata: {
      get(): MetadataDto {
        return this.value
      },
      set(v: MetadataDto) {
        this.$emit('input', v)
      },
    },
  },
  watch: {
    metadata(meta: MetadataDto) {
      const obj = Object.entries(meta).map(([key, value]) => ({
        key,
        type: typeof value as MetadataType,
        value,
      }))
      if (!isEqual(this.metadataList, obj)) this.metadataList = obj
    },
    metadataList: {
      deep: true,
      handler(metadataList: MetadataObject[]) {
        this.metadata = metadataList.reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {} as MetadataDto,
        )
      },
    },
  },
  methods: {
    isDeleted(meta: MetadataObject): boolean {
      return meta.type === MetadataType.Deleted
    },
    addField() {
      this.metadataList = [...this.metadataList, { key: '', type: MetadataType.String, value: '' }]
    },
    removeField(key: string) {
      this.metadataList = this.metadataList.map((meta) =>
        meta.key === key ? { ...meta, type: MetadataType.Deleted, value: null } : meta,
      )
    },
    restoreField(key: string) {
      this.metadataList = this.metadataList.map((meta) =>
        meta.key === key ? { ...meta, type: MetadataType.String, value: '' } : meta,
      )
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
  }

  &__empty {
    width: 100%;
  }
}
</style>

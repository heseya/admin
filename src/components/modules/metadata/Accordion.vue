<template>
  <a-collapse
    accordion
    :bordered="false"
    class="metadata-form-accrodion"
    :class="{ 'metadata-form-accrodion--white': white }"
  >
    <template #expandIcon="{ isActive }">
      <div>
        <i v-if="isActive" class="bx bx-chevron-up"></i>
        <i v-else class="bx bx-chevron-down"></i>
      </div>
    </template>

    <a-collapse-panel>
      <template #header>
        <span class="metadata-form-accrodion__title">
          {{ isPrivate ? $t('privateTitle') : $t('title') }}
          <info-tooltip>
            {{ isPrivate ? $t('privateTitleTooltip') : $t('titleTooltip') }}
          </info-tooltip>
        </span>
      </template>
      <MetadataForm
        ref="form"
        :original-metadata="value"
        :is-private="isPrivate"
        :disabled="disabled"
        :model="model"
      />
    </a-collapse-panel>
  </a-collapse>
</template>

<i18n>
{
  "pl": {
    "title": "Metadane",
    "titleTooltip": "Metadane pozwalają na rozszerzenie informacji o obiekcie. Mogą być używane przez integracje do innych systemów. Są publiczne, więc każdy kto ma dostęp do zasobu może je odczytać.",
    "privateTitle": "Prywatne metadane",
    "privateTitleTooltip": "Mechanizm analogiczny do metadanych, ale dostępne tylko dla użytkowników posiadających dodatkowe dedykowane uprawnienie. Tych informacji nie powinien widzieć zwykły użytkownik sklepu."
  },
  "en": {
    "title": "Metadata",
    "titleTooltip": "Metadata allow to extend information about object. They can be used by integrations with other systems. They are public, so anyone who has access to the resource can read them.",
    "privateTitle": "Private metadata",
    "privateTitleTooltip": "Similar to metadata, but available only for users with additional dedicated permission. These information should not be seen by regular users of the store."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import MetadataForm from './Form.vue'
import { MetadataDto } from '@/interfaces/Metadata'
import { GeneratedStoreModulesKeys } from '@/store'

export type SaveMetadataFunction = (id: string) => Promise<void>
export type MetadataRef = Vue & { saveMetadata: SaveMetadataFunction }

export default Vue.extend({
  components: {
    MetadataForm,
  },
  props: {
    value: {
      type: Object,
      default: () => {},
    } as Vue.PropOptions<MetadataDto>,
    disabled: { type: Boolean, default: false },
    white: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    model: {
      type: String,
      required: true,
    } as Vue.PropOptions<GeneratedStoreModulesKeys>,
  },
  methods: {
    async saveMetadata(id: string) {
      // component may not be mounted before the save is triggered, then simply ignore
      await (this.$refs.form as Vue & { saveMetadata?: SaveMetadataFunction })?.saveMetadata?.(id)
    },
  },
})
</script>

<style lang="scss">
.metadata-form-accrodion {
  &__title {
    font-weight: 600;
  }

  &--white .ant-collapse-item {
    background-color: #fff;
  }
}
</style>

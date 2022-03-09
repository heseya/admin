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
          {{ private ? $t('privateTitle') : $t('title') }}
          <info-tooltip>
            {{ private ? $t('privateTitleTooltip') : $t('titleTooltip') }}
          </info-tooltip>
        </span>
      </template>
      <MetadataForm v-model="form" :private="private" :disabled="disabled" />
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

export default Vue.extend({
  components: {
    MetadataForm,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<MetadataDto>,
    disabled: { type: Boolean, default: false },
    white: { type: Boolean, default: false },
    private: { type: Boolean, default: false },
  },
  computed: {
    form: {
      get(): MetadataDto {
        return this.value
      },
      set(v: MetadataDto) {
        this.$emit('input', v)
      },
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

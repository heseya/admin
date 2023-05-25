<template>
  <LayoutAccordion accordion :white="white">
    <template #title>
      {{ $t(`${type}.title`) }}
      <info-tooltip>
        {{ $t(`${type}.tooltip`) }}
      </info-tooltip>
    </template>

    <MetadataForm
      ref="form"
      :original-metadata="value"
      :type="type"
      :disabled="disabled"
      :model="model"
    />
  </LayoutAccordion>
</template>

<i18n lang="json">
{
  "pl": {
    "default": {
      "title": "Metadane",
      "tooltip": "Metadane pozwalają na rozszerzenie informacji o obiekcie. Mogą być używane przez integracje do innych systemów. Są publiczne, więc każdy kto ma dostęp do zasobu może je odczytać."
    },
    "private": {
      "title": "Prywatne metadane",
      "tooltip": "Mechanizm analogiczny do metadanych, ale dostępne tylko dla użytkowników posiadających dodatkowe dedykowane uprawnienie. Tych informacji nie powinien widzieć zwykły użytkownik sklepu."
    },
    "personal": {
      "title": "Metadane osobiste",
      "tooltip": "Mechanizm analogiczny do metadanych, ale dostępne tylko dla użytkownika, który je utworzył. Tych informacji nie powinien widzieć inny użytkownik sklepu poza administracją."
    }
  },
  "en": {
    "default": {
      "title": "Metadata",
      "tooltip": "Metadata allows you to extend the information about the object. They can be used by integrations to other systems. They are public, so anyone who has access to the resource can read them."
    },
    "private": {
      "title": "Private metadata",
      "tooltip": "A mechanism similar to metadata, but available only to users with additional dedicated permission. These information should not be seen by a regular store user."
    },
    "personal": {
      "title": "Personal metadata",
      "tooltip": "A mechanism similar to metadata, but available only to the user who created them. These information should not be seen by other store users except for administration."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Metadata, MetadataUpdateDto } from '@heseya/store-core'

import MetadataForm from './Form.vue'
import LayoutAccordion from '@/components/layout/Accordion.vue'

import { GeneratedStoreModulesKeys } from '@/store'

export type SaveMetadataFunction = (id: string) => Promise<Metadata | undefined>
export type MetadataRef = Vue & { saveMetadata: SaveMetadataFunction }

export default Vue.extend({
  components: {
    MetadataForm,
    LayoutAccordion,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    } as Vue.PropOptions<MetadataUpdateDto>,
    disabled: { type: Boolean, default: false },
    white: { type: Boolean, default: false },
    type: { type: String, default: 'default' } as Vue.PropOptions<
      'default' | 'private' | 'personal'
    >,
    model: {
      type: String,
      required: true,
    } as Vue.PropOptions<GeneratedStoreModulesKeys | 'auth'>,
  },
  methods: {
    saveMetadata(id: string) {
      // component may not be mounted before the save is triggered, then simply ignore
      return (this.$refs.form as Vue & { saveMetadata?: SaveMetadataFunction })?.saveMetadata?.(id)
    },
  },
})
</script>

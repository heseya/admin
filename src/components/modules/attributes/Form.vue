<template>
  <validation-observer v-slot="{ handleSubmit }" class="attribute-form">
    <validated-input
      v-model="form.name"
      :disabled="disabled"
      name="name"
      rules="required"
      :label="$t('common.form.name')"
      @input="editSlug"
    />
    <validated-input
      v-model="form.slug"
      :disabled="disabled"
      name="slug"
      rules="required|slug"
      :label="$t('form.slug')"
    />
    <validated-input
      v-model="form.description"
      :disabled="disabled"
      name="description"
      :label="$t('common.form.description')"
    />

    <div class="attribute-form__switches">
      <switch-input v-model="form.global" :disabled="disabled" horizontal>
        <template #title>
          {{ $t('form.global') }}
          <info-tooltip> {{ $t('form.globalTooltip') }}</info-tooltip>
        </template>
      </switch-input>

      <switch-input v-model="form.sortable" :disabled="disabled" horizontal>
        <template #title>
          {{ $t('form.sortable') }}
          <info-tooltip> {{ $t('form.sortableTooltip') }}</info-tooltip>
        </template>
      </switch-input>
    </div>

    <app-select v-model="form.type" :label="$t('common.form.type')" :disabled="disabled || !isNew">
      <a-select-option
        v-for="type in AttributeType"
        :key="type"
        :value="type"
        :label="$t('attributeTypes.' + type)"
      >
        {{ $t('attributeTypes.' + type) }}
      </a-select-option>
    </app-select>

    <br />
    <app-button data-cy="submit-btn" :disabled="disabled" @click.stop="handleSubmit(submit)">
      {{ $t('common.save') }}
    </app-button>

    <template v-if="!isNew">
      <hr />
      <OptionsList :attribute-id="attribute.id" :disabled="disabled" :type="form.type" />
    </template>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "slug": "Skrócona nazwa",
      "global": "Globalna cecha",
      "globalTooltip": "Globalna cecha oznacza, że po danej cesze można filtrować produkty niezależnie od kolekcji w której się one znajdują.",
      "sortable": "Sortowalna cecha",
      "sortableTooltip": "Sortowalna cecha oznacza, że po danej cesze można sortować listę produktów."
    },
    "alerts": {
      "created": "Cecha została utworzona.",
      "updated": "Cecha została zaktualizowana."
    }
  },
  "en": {
    "form": {
      "slug": "Short name",
      "global": "Global attribute",
      "globalTooltip": "Global attribute means that you can filter products independently from the collection in which they are located.",
      "sortable": "Sortable attribute",
      "sortableTooltip": "Sortable attribute means that you can sort products by this attribute."
    },
    "alerts": {
      "created": "Attribute has been created.",
      "updated": "Attribute has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import { generateSlug } from '@/utils/generateSlug'

import {
  Attribute,
  AttributeCreateDto,
  AttributeUpdateDto,
  AttributeType,
} from '@heseya/store-core'
import { UUID } from '@/interfaces/UUID'

import OptionsList from './OptionsList.vue'

const CLEAR_FORM: AttributeCreateDto = {
  name: '',
  slug: '',
  description: '',
  type: AttributeType.SingleOption,
  sortable: false,
  global: false,
}

export default Vue.extend({
  components: {
    ValidationObserver,
    OptionsList,
  },
  props: {
    attribute: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Attribute>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    form: {} as (AttributeCreateDto | AttributeUpdateDto) & { id?: UUID },
    AttributeType: AttributeType,
  }),
  computed: {
    isNew(): boolean {
      return !this.form.id
    },
  },
  watch: {
    attribute(v) {
      this.form = cloneDeep({ ...CLEAR_FORM, ...v })
    },
  },
  created() {
    this.form = cloneDeep({ ...CLEAR_FORM, ...this.attribute })
  },
  methods: {
    editSlug() {
      if (this.isNew) this.form.slug = generateSlug(this.form.name)
    },
    async submit() {
      this.$accessor.startLoading()
      try {
        if (!this.form?.id) {
          const newAttribute = await this.$accessor.attributes.add(this.form)
          if (!newAttribute || !newAttribute.id) throw new Error('Attribute not created')

          this.$toast.success(this.$t('alerts.created') as string)
          this.$emit('submit', newAttribute)
        } else {
          const editedAttribute = await this.$accessor.attributes.update({
            id: this.form.id,
            item: this.form,
          })
          if (!editedAttribute) throw new Error('Attribute not updated')

          this.$toast.success(this.$t('alerts.updated') as string)
          this.$emit('submit', editedAttribute)
        }
      } catch {
      } finally {
        this.$accessor.stopLoading()
      }
    },
  },
})
</script>

<style lang="scss">
.attribute-form {
  &__switches {
    display: flex;
    justify-content: space-evenly;
    gap: 8px;
  }
}
</style>

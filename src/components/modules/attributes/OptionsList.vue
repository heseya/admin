<template>
  <div class="attributes-options-form">
    <div class="attributes-options-form__header">
      <h4>{{ $t('title') }}</h4>
      <icon-button
        size="small"
        :disabled="disabled || !areOptionsEditable"
        @click="openAddOptionModal"
      >
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('add') }}
      </icon-button>
    </div>

    <div v-if="options.length" class="attributes-options-form__content">
      <div
        v-for="(option, i) in options"
        :key="option.id || i"
        class="attributes-options-form__option"
      >
        <span class="attributes-options-form__option-value">
          {{ option.value_number || option.value_date || option.name }}
          <template v-if="option.value_number">({{ option.name }})</template>
        </span>

        <template v-if="areOptionsEditable">
          <icon-button size="small" :disabled="disabled" @click="openEditOptionModal(option)">
            <template #icon>
              <i class="bx bx-edit"></i>
            </template>
          </icon-button>

          <pop-confirm
            :disabled="disabled"
            :title="$t('deleteText')"
            :ok-text="$t('common.delete')"
            :cancel-text="$t('common.cancel')"
            @confirm="removeOption(option)"
          >
            <icon-button size="small" type="danger" :disabled="disabled">
              <template #icon>
                <i class="bx bx-trash"></i>
              </template>
            </icon-button>
          </pop-confirm>
        </template>
      </div>
    </div>

    <empty v-else>{{ $t('empty') }}</empty>

    <pagination
      v-if="optionsMeta.lastPage > 1"
      class="attributes-options-form__pagination"
      :length="optionsMeta.lastPage"
      :value="optionsMeta.currentPage"
      @input="fetchOptions"
    />

    <options-edit-form
      v-model="editedOption"
      :attribute-id="attributeId"
      :type="type"
      :disabled="disabled"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Opcje cechy",
    "add": "Dodaj opcję",
    "empty": "Brak opcji",
    "deleteText": "Czy na pewno chcesz usunąć tę opcję?",
    "deleteSuccess": "Opcja została usunięta"
  },
  "en": {
    "title": "Attribute options",
    "add": "Add option",
    "empty": "No options",
    "deleteText": "Are you sure you want to delete this option?",
    "deleteSuccess": "Option deleted"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'
import { cloneDeep } from 'lodash'
import {
  AttributeOption,
  AttributeOptionDto,
  AttributeType,
  HeseyaPaginationMeta,
} from '@heseya/store-core'

import Empty from '@/components/layout/Empty.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import OptionsEditForm from './OptionsEditForm.vue'
import { formatApiNotificationError } from '@/utils/errors'
import Pagination from '@/components/cms/Pagination.vue'

const EMPTY_FORM: AttributeOptionDto = {
  name: '',
  value_number: null,
  value_date: null,
}

export default defineComponent({
  components: { Empty, PopConfirm, OptionsEditForm, Pagination },
  props: {
    attributeId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    } as PropOptions<AttributeType>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    editedOption: null as AttributeOptionDto | null,
  }),

  computed: {
    options(): AttributeOption[] {
      return this.$accessor.attributes.options
    },
    optionsMeta(): HeseyaPaginationMeta {
      return this.$accessor.attributes.optionsMeta
    },
    areOptionsEditable(): boolean {
      return (
        this.type === AttributeType.SingleOption || this.type === AttributeType.MultiChoiceOption
      )
    },
  },

  created() {
    this.fetchOptions(1)
  },

  methods: {
    async fetchOptions(page: number) {
      this.$accessor.startLoading()
      await this.$accessor.attributes.getOptions({
        attributeId: this.attributeId,
        params: {
          limit: 24,
          page,
        },
      })
      this.$accessor.stopLoading()
    },

    async removeOption(option: AttributeOption) {
      this.$accessor.startLoading()
      try {
        await this.$accessor.attributes.deleteOption({
          attributeId: this.attributeId,
          optionId: option.id,
        })
        this.$toast.success(this.$t('deleteSuccess') as string)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.$accessor.stopLoading()
    },

    openAddOptionModal() {
      this.editedOption = cloneDeep(EMPTY_FORM)
    },

    openEditOptionModal(option: AttributeOption) {
      this.editedOption = cloneDeep(option)
    },
  },
})
</script>

<style lang="scss" scoped>
.attributes-options-form {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__pagination {
    margin-top: 12px;
  }

  &__option {
    display: flex;
    align-items: center;
    transition: 0.3s;
    padding: 2px 8px;
    border-radius: 4px;

    &:hover {
      background: var(--background-color-500);
    }

    > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &__option-value {
    display: block;
    margin-right: auto !important;
  }
}
</style>

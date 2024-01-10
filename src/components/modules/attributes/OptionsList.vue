<template>
  <div class="attributes-options-form">
    <Loading :active="isLoading" />

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

    <Draggable
      v-if="options.length"
      :value="options"
      handle=".reorder-handle"
      class="attributes-options-form__content"
      @input="handleReorder"
    >
      <div
        v-for="(option, i) in options"
        :key="option.id || i"
        class="attributes-options-form__option"
      >
        <DraggableHandle
          btn-class="attributes-options-form__reorder reorder-handle"
          @move-to-top="handleReorderToIndex(option, 0)"
          @move-one-up="handleReorderToIndex(option, i - 1)"
          @move-one-down="handleReorderToIndex(option, i + 1)"
          @move-to-bottom="handleReorderToIndex(option, options.length - 1)"
        />

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
            :title="$t('deleteText').toString()"
            :ok-text="$t('common.delete').toString()"
            :cancel-text="$t('common.cancel').toString()"
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
    </Draggable>

    <empty v-else>{{ $t('empty') }}</empty>

    <pagination
      v-if="optionsMeta.lastPage > 1"
      class="attributes-options-form__pagination"
      :length="optionsMeta.lastPage"
      :value="optionsMeta.currentPage"
      @input="fetchOptions"
    />

    <OptionsEditForm
      v-if="editedOption"
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
    "title": "Opcje atrybutów",
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
import { defineComponent, PropType } from 'vue'
import { cloneDeep } from 'lodash'
import {
  AttributeOption,
  AttributeOptionDto,
  AttributeType,
  HeseyaPaginationMeta,
} from '@heseya/store-core'
import Draggable from 'vuedraggable'

import Empty from '@/components/layout/Empty.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import OptionsEditForm from './OptionsEditForm.vue'
import { formatApiNotificationError } from '@/utils/errors'
import Pagination from '@/components/cms/Pagination.vue'
import Loading from '@/components/layout/Loading.vue'
import DraggableHandle from '@/components/cms/DraggableHandle.vue'

const EMPTY_FORM: AttributeOptionDto = {
  value_number: null,
  value_date: null,
  translations: {},
}

export default defineComponent({
  components: {
    Empty,
    PopConfirm,
    OptionsEditForm,
    Pagination,
    Draggable,
    Loading,
    DraggableHandle,
  },
  props: {
    attributeId: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<AttributeType>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isLoading: false,
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
      this.isLoading = true
      await this.$accessor.attributes.getOptions({
        attributeId: this.attributeId,
        params: {
          limit: 48,
          page,
        },
      })
      this.isLoading = false
    },

    handleReorderToIndex(option: AttributeOption, index: number) {
      if (index < 0) index = 0
      if (index >= this.options.length) index = this.options.length - 1
      const options = [...this.options]
      options.splice(options.indexOf(option), 1)
      options.splice(index, 0, option)
      this.handleReorder(options)
    },

    async handleReorder(options: AttributeOption[]) {
      this.isLoading = true
      await this.$accessor.attributes.reorderOptions({
        parentId: this.attributeId,
        ids: options.map((option) => option?.id).filter(Boolean),
      })
      await this.fetchOptions(this.optionsMeta.currentPage)
      this.isLoading = false
    },

    async removeOption(option: AttributeOption) {
      this.isLoading = true
      try {
        await this.$accessor.attributes.deleteOption({
          attributeId: this.attributeId,
          optionId: option.id,
        })
        this.$toast.success(this.$t('deleteSuccess') as string)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.isLoading = false
    },

    openAddOptionModal() {
      this.editedOption = cloneDeep(EMPTY_FORM)
    },

    openEditOptionModal(option: AttributeOption) {
      this.editedOption = {
        ...cloneDeep(option),
        translations: cloneDeep(option.translations || {}),
      }
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

  &__content {
    position: relative;
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

  &__reorder {
    cursor: move;
    color: $gray-color-500;
    margin-bottom: -1px;
  }

  &__option-value {
    display: block;
    margin-right: auto !important;
  }
}
</style>

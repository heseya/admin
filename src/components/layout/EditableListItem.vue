<template>
  <list-item class="editable-list-item">
    <slot v-bind="{ item }"></slot>

    <template #action>
      <div class="editable-list-item__actions">
        <slot name="action"></slot>

        <icon-button size="small" :disabled="disabled" @click="onEdit">
          <template #icon>
            <i class="bx bx-edit"></i>
          </template>
        </icon-button>

        <pop-confirm
          :disabled="disabled"
          :ok-text="$t('common.delete').toString()"
          :cancel-text="$t('common.cancel').toString()"
          :title="deleteText || $t('deleteText').toString()"
          @confirm="onRemove"
        >
          <icon-button size="small" type="danger" :disabled="disabled">
            <template #icon>
              <i class="bx bx-trash"></i>
            </template>
          </icon-button>
        </pop-confirm>
      </div>
    </template>
  </list-item>
</template>

<i18n lang="json">
{
  "en": {
    "deleteText": "Are you sure you want to delete?"
  },
  "pl": {
    "deleteText": "Czy na pewno chcesz usunąć?"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import IconButton from './IconButton.vue'
import ListItem from './ListItem.vue'
import PopConfirm from './PopConfirm.vue'

export default defineComponent({
  components: { ListItem, IconButton, PopConfirm },
  props: {
    item: {
      type: Object as PropType<{ id: string }>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    deleteText: {
      type: String,
      default: '',
    },
  },

  methods: {
    onEdit() {
      this.$emit('edit', this.item)
    },
    onRemove() {
      this.$emit('remove', this.item)
    },
  },
})
</script>

<style lang="scss" scoped>
.editable-list-item {
  background-color: #fff;

  &__actions {
    display: flex;
    align-items: center;
  }
}
</style>

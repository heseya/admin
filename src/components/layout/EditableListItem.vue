<template>
  <list-item class="editable-list-item">
    <slot v-bind="{ item }"></slot>

    <template #action>
      <div class="editable-list-item__actions">
        <icon-button size="small" :disabled="disabled" @click="onEdit">
          <template #icon>
            <i class="bx bx-edit"></i>
          </template>
        </icon-button>

        <pop-confirm
          :disabled="disabled"
          :title="deleteText || $t('deleteText')"
          :ok-text="$t('common.delete')"
          :cancel-text="$t('common.cancel')"
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
import Vue from 'vue'

import IconButton from './IconButton.vue'
import ListItem from './ListItem.vue'
import PopConfirm from './PopConfirm.vue'

export default Vue.extend({
  components: { ListItem, IconButton, PopConfirm },
  props: {
    item: {
      type: Object,
      required: true,
    } as Vue.PropOptions<{ id: string }>,
    disabled: {
      type: Boolean,
      default: false,
    } as Vue.PropOptions<boolean>,
    deleteText: {
      type: String,
      default: '',
    } as Vue.PropOptions<string>,
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
  }
}
</style>

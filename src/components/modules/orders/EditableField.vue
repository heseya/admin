<template>
  <div class="order-field" :class="{ 'order-field--horizontal': horizontal }">
    <span class="order-field__label">
      <slot name="label">
        {{ label }}
      </slot>
      <slot name="labelSuffix"></slot>
      <icon-button
        v-can="$p.Orders.Edit"
        size="small"
        type="transparent"
        class="editable-address__btn editable-address__btn--edit"
        @click="edit"
      >
        <template #icon>
          <i class="bx bxs-pencil"></i>
        </template>
      </icon-button>
    </span>
    <div class="order-field__value">
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    edit() {
      this.$emit('edit')
    },
  },
})
</script>

<style lang="scss" scoped>
.order-field {
  padding: 4px 12px;
  position: relative;

  &__label {
    display: flex;
    align-items: center;
    color: $gray-color-500;
    font-size: 0.9em;
  }

  &__value {
    display: flex;
    align-items: center;
  }

  &--horizontal {
    display: flex;
    align-items: center;
  }
  &--horizontal &__label {
    font-size: 1em;
    margin-right: 8px;
  }
}
.editable-address {
  &__btn {
    &--edit {
      @media ($viewport-8) {
        position: absolute;
        right: -14px;
      }
    }
  }
}
</style>

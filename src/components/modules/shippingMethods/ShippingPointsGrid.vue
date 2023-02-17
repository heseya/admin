<template>
  <div class="shipping-points">
    <div v-for="(point, index) in shippingPoints" :key="point.id" class="shipping-points__point">
      <div class="shipping-points__info">
        <span class="shipping-points__name">{{ point.name }}</span>
        <span>{{ point.address }}</span>
        <span>{{ point.zip }} {{ point.city }}</span>
        <span>
          {{ point.country_name || point.country }}
        </span>
      </div>
      <icon-button
        size="small"
        type="transparent"
        class="editable-address__btn editable-address__btn--edit"
        @click="$emit('edit', { point, index })"
      >
        <template #icon>
          <i class="bx bxs-pencil"></i>
        </template>
      </icon-button>
      <icon-button
        size="small"
        type="transparent"
        class="editable-address__btn editable-address__btn--edit"
        @click="$emit('remove', index)"
      >
        <template #icon>
          <i class="bx bxs-trash"></i>
        </template>
      </icon-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AddressDto } from '@heseya/store-core'

export default Vue.extend({
  name: 'AddressForm',
  props: {
    shippingPoints: {
      type: Array,
      required: true,
    } as Vue.PropOptions<AddressDto[]>,
  },
})
</script>

<style lang="scss" scoped>
.shipping-points-container {
  width: 100%;
}

.shipping-points {
  display: flex;
  flex-flow: wrap;
  padding: 0;
  width: 100%;

  &__point {
    display: flex;
    align-items: center;
    margin: 4px 0 4px 4px;
    padding: 0 0 0 10px;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fafafa;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
  }

  &__name {
    font-weight: 600;
  }

  &__info {
    display: flex;
    flex-flow: column;

    span {
      font-size: 12px;
    }
  }
}
</style>

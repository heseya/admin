<template>
  <div class="address">
    <icon-button
      v-if="!hideEdit"
      v-can="$p.Orders.Edit"
      size="small"
      type="transparent"
      class="address__btn address__btn--edit"
      @click="edit"
    >
      <i slot="icon" class="bx bxs-pencil"></i>
    </icon-button>
    <pop-confirm
      v-if="!hideRemove && address"
      v-can="$p.Orders.Edit"
      title="Czy na pewno chcesz usunąć adres?"
      ok-text="Usuń"
      cancel-text="Anuluj"
      @confirm="remove"
    >
      <icon-button size="small" type="transparent" class="address__btn address__btn--remove">
        <i slot="icon" class="bx bxs-trash"></i>
      </icon-button>
    </pop-confirm>

    <template v-if="address">
      <span class="address__name">{{ address.name }}</span>
      <span class="address__field">{{ address.address }}</span>
      <span class="address__field"> {{ address.zip }} {{ address.city }} </span>
      <span class="address__field">
        {{ address.country_name || address.country }}
      </span>
      <template v-if="address.vat">
        <span class="address__subtitle">NIP:</span>
        <span class="address__field">{{ address.vat }}</span>
      </template>
      <template v-if="address.phone">
        <span class="address__subtitle">Telefon:</span>
        <span class="address__field">{{ address.phone }}</span>
      </template>
    </template>
    <template v-else>
      <small class="address__error">Brak podanego adresu</small>
    </template>
  </div>
</template>

<script lang="ts">
import { Address } from '@/interfaces/Address'
import Vue from 'vue'
import PopConfirm from '../../layout/PopConfirm.vue'

export default Vue.extend({
  name: 'Address',
  components: { PopConfirm },
  props: {
    address: {
      type: Object,
      default: () => null,
    } as Vue.PropOptions<Address>,
    hideEdit: {
      type: Boolean,
      default: false,
    },
    hideRemove: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    edit() {
      this.$emit('edit')
    },
    remove() {
      this.$emit('remove')
    },
  },
})
</script>

<style lang="scss" scoped>
.address {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  color: #666666;
  position: relative;

  &__btn {
    position: absolute;
    top: -38px;
    right: 0;

    &--remove {
      right: 30px;
    }
  }

  &__field {
    display: block;
  }

  &__name {
    font-size: 1.1em;
    font-weight: 600;
    margin-bottom: 3px;
    color: #000000;
  }

  &__subtitle {
    font-weight: 500;
    font-size: 0.9em;
    color: #000000;
    margin-top: 4px;
  }

  &__error {
    counter-reset: #cccccc;
    font-weight: 300;
  }
}
</style>

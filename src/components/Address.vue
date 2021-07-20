<template>
  <div class="address">
    <vs-button v-if="!hideEdit" size="tiny" dark class="address__edit" @click="edit">
      <i class="bx bxs-pencil"></i>
    </vs-button>
    <template v-if="address">
      <span class="address__name">{{ address.name }}</span>
      <span class="address__field">{{ address.address }}</span>
      <span class="address__field"> {{ address.zip }} {{ address.city }} </span>
      <span class="address__field">
        {{ address.country_name || address.country }}
      </span>
      <template v-if="address.vat">
        <span class="address__subtitle">VAT:</span>
        <span class="address__field">{{ address.vat }}</span>
      </template>
      <template v-if="address.phone">
        <span class="address__subtitle">Telefon:</span>
        <span class="address__field">{{ address.phone }}</span>
      </template>
    </template>
    <template v-else>
      <span class="address__error">Address is not provided!</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Address',
  props: {
    address: {
      type: Object,
      default: () => ({}),
    },
    hideEdit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    edit() {
      this.$emit('edit')
    },
  },
}
</script>

<style lang="scss" scoped>
.address {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  color: #666;
  position: relative;

  &__edit {
    position: absolute;
    top: -10px;
    right: 0;
  }

  &__field {
    display: block;
  }

  &__name {
    font-size: 1.1em;
    margin-bottom: 3px;
    color: #000;
  }

  &__subtitle {
    font-family: $font-sec;
    color: #000;
    margin-top: 4px;
  }

  &__error {
    counter-reset: #ccc;
    font-weight: 300;
  }
}
</style>

<template>
  <div class="address">
    <span class="address__name">{{ address.name }}</span>
    <span class="address__field">{{ address.address }}</span>
    <span class="address__field">{{ address.zip }} {{ address.city }}</span>
    <span class="address__field">{{ address.country }}</span>
    <span class="address__field" v-if="address.vat">VAT: {{ address.vat }}</span>
    <span class="address__field" v-if="address.phone">Tel: {{ address.phone }}</span>
  </div>
</template>

<script>
export default {
  name: 'Address',
  props: {
    address: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
.address {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  color: #444;

  span {
    display: block;
  }

  &__name {
    font-size: 1.1em;
    margin-bottom: 3px;
    color: #111;
  }
}
</style>

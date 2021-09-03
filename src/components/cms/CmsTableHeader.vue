<template>
  <div
    class="cms-table-header"
    :style="{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }"
    @click.stop="click"
  >
    <div v-for="{ key, label } in labels" :key="key" class="cms-table-header__col">
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    labels: {
      type: Array,
      required: true,
    } as Vue.PropOptions<{ key: string; label: string }[]>,
  },
  methods: {
    click() {
      this.$emit('click')
    },
  },
})
</script>

<style lang="scss">
.cms-table-header {
  all: unset;
  display: grid;
  // grid-template-columns: 1fr 1fr 1fr 1fr;
  border-bottom: 2px solid #eceef5;

  &__col {
    padding: 12px 16px;
    text-transform: uppercase;
    color: #7b8589;
    font-size: 0.8em;
  }
}
</style>

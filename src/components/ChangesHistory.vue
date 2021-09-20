<template>
  <div class="changes-history">
    <icon-button @click="downloadAudits">
      <i slot="icon" class="bx bx-history"></i>
      Pobierz historię zmian
    </icon-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { downloadJsonAsFile } from '@/utils/download'

import { UUID } from '@/interfaces/UUID'
import { StoreModulesKeys } from '@/store'

export default Vue.extend({
  props: {
    model: {
      type: String,
      required: true,
    } as Vue.PropOptions<Exclude<StoreModulesKeys, 'auth'>>,
    id: {
      type: String,
      required: true,
    } as Vue.PropOptions<UUID>,
  },
  methods: {
    async downloadAudits() {
      const data = await this.$accessor[this.model].fetchAudits(this.id)
      downloadJsonAsFile(data, `${this.id}-${this.model}-history`)
    },
  },
})
</script>

<style lang="scss" scoped>
.changes-history {
}
</style>

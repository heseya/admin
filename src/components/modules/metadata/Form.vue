<template>
  <modal-form class="metadata-form"> {{ metadata }} </modal-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetadataDto } from '@/interfaces/Metadata'
import ModalForm from '@/components/form/ModalForm.vue'

export default Vue.extend({
  components: { ModalForm },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<MetadataDto>,
    disabled: { type: Boolean, default: false },
    private: { type: Boolean, default: false },
  },
  computed: {
    metadata: {
      get(): MetadataDto {
        return this.value
      },
      set(v: MetadataDto) {
        this.$emit('input', v)
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.metadata-form {
}
</style>

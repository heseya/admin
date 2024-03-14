<template>
  <div>
    <a-modal
      v-model="isFormModalActive"
      width="1000px"
      :footer="null"
      :title="editedAttribute.id ? $t('editTitle') : $t('newTitle')"
    >
      <modal-form v-if="isFormModalActive">
        <AttributeForm :attribute="editedAttribute" :disabled="disabled" @submit="addAttribute" />
      </modal-form>
    </a-modal>

    <a-modal v-model="isSelectorModalActive" width="800px" :footer="null">
      <template #title>
        <h4 class="attributes-selector-header">
          {{ $t('chooseExisting') }}
          <icon-button
            v-can="$p.Attributes.Add"
            reversed
            size="small"
            @click="
              isSelectorModalActive = false
              isFormModalActive = true
            "
          >
            <template #icon> <i class="bx bx-plus"></i> </template> {{ $t('createNew') }}
          </icon-button>
        </h4>
      </template>
      <modal-form v-if="isSelectorModalActive">
        <Selector
          type="attributes"
          :type-name="$t('typeName').toString()"
          :existing="existing"
          @select="addAttribute"
        />
      </modal-form>
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "createNew": "Create new attribute",
    "chooseExisting": "Choose existing attribute",
    "typeName": "attribute",
    "editTitle": "Edit attribute",
    "newTitle": "New attribute"
  },
  "pl": {
    "createNew": "Utwórz nowy atrybut",
    "chooseExisting": "Wybierz istniejący atrybut",
    "typeName": "atrybut",
    "editTitle": "Edytuj atrybut",
    "newTitle": "Nowy atrybut"
  }
}
</i18n>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { Attribute, ProductAttribute } from '@heseya/store-core'

import Selector from '@/components/Selector.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import AttributeForm from '@/components/modules/attributes/Form.vue'

import { formatApiNotificationError } from '@/utils/errors'

export default defineComponent({
  components: { Selector, ModalForm, AttributeForm },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    existing: {
      type: Array as PropType<{ id: string; name: string }[]>,
      default: () => [],
    },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isFormModalActive: false,
    editedAttribute: {} as Attribute,
  }),
  computed: {
    isSelectorModalActive: {
      get(): boolean {
        return this.value
      },
      set(val: boolean) {
        this.$emit('input', val)
      },
    },
  },
  watch: {
    isFormModalActive() {
      if (!this.isFormModalActive) {
        this.editedAttribute = {} as Attribute
      }
    },
    '$accessor.attributes.getError'(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  methods: {
    addAttribute(attribute: ProductAttribute) {
      this.$emit('add', attribute)
      this.isFormModalActive = false
      this.isSelectorModalActive = false
    },
  },
})
</script>

<style lang="scss" scoped>
.attributes-selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

<template>
  <validation-observer v-slot="{ handleSubmit }">
    <vs-dialog width="550px" not-center :value="isOpen" @input="$emit('close')">
      <template #header>
        <h4>{{ form.id ? 'Edycja kolekcji' : 'Nowa kolekcja' }}</h4>
      </template>
      <modal-form>
        <validated-input rules="required" v-model="form.name" @input="editSlug" label="Nazwa" />
        <validated-input rules="required|slug" v-model="form.slug" label="Link" />
        <div class="switches">
          <flex-input>
            <switch-input horizontal v-model="form.public" label="Widoczność kolekcji" />
          </flex-input>
          <flex-input>
            <switch-input
              horizontal
              v-model="form.hide_on_index"
              label="Ukryj na stronie głównej"
            />
          </flex-input>
        </div>
      </modal-form>
      <template #footer>
        <div class="row">
          <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
          <pop-confirm
            title="Czy na pewno chcesz usunąć tę kolekcję? Wraz z nią usuniesz wszystkie jej subkolekcje!"
            okText="Usuń"
            cancelText="Anuluj"
            @confirm="deleteItem"
            v-slot="{ open }"
          >
            <vs-button v-if="form.id" color="danger" @click="open">Usuń</vs-button>
          </pop-confirm>
        </div>
      </template>
    </vs-dialog>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import slugify from 'slugify'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'

import ModalForm from '@/components/ModalForm.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'
import SwitchInput from '@/components/SwitchInput.vue'

import { ProductSet } from '@/interfaces/ProductSet'

export default Vue.extend({
  components: {
    ModalForm,
    PopConfirm,
    FlexInput,
    ValidationObserver,
    ValidatedInput,
    SwitchInput,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductSet>,
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    form: {} as ProductSet,
  }),
  watch: {
    value(value: ProductSet) {
      this.form = cloneDeep(value)
    },
  },
  methods: {
    editSlug() {
      if (!this.form.id) {
        this.form.slug = slugify(this.form.name, { lower: true, remove: /[.]/g })
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.form.id) {
        await this.$store.dispatch('productSets/update', {
          id: this.form.id,
          item: this.form,
        })
      } else {
        await this.$store.dispatch('productSets/add', this.form)
      }
      this.$accessor.stopLoading()
      this.$emit('close')
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$store.dispatch('productSets/remove', this.form.id)
      this.$accessor.stopLoading()
      this.$emit('close')
    },
  },
})
</script>

<style lang="scss" scoped>
.switches {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 10px;
}
</style>

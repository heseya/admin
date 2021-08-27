<template>
  <validation-observer v-slot="{ handleSubmit }" class="product-set-form">
    <a-modal
      :title="form.id ? 'Edycja kolekcji' : 'Nowa kolekcja'"
      :visible="isOpen"
      @cancel="$emit('close')"
    >
      <modal-form class="product-set-form">
        <validated-input
          v-model="form.name"
          :disabled="disabled"
          rules="required"
          label="Nazwa"
          @input="editSlug"
        />

        <div class="slug-input">
          <span v-if="slugPrefix && !form.slug_override" class="slug-input__prefix">
            {{ slugPrefix }}-
          </span>

          <validated-input
            v-model="form.slug_suffix"
            :disabled="disabled"
            class="slug-input__input"
            rules="required|slug"
            label="Link"
          />

          <vs-tooltip bottom>
            <switch-input
              v-if="slugPrefix"
              v-model="form.slug_override"
              :disabled="disabled"
              class="slug-input__switch"
              label="Nadpisz link"
            />

            <template #tooltip>
              Domyślnie, początek linku wynika z linku kolekcji-rodzica. Nadpisując link, sprawiamy,
              że link będzie dokładnie taki jaki zostanie wpisany.
            </template>
          </vs-tooltip>
        </div>

        <div class="switches">
          <flex-input>
            <switch-input
              v-model="form.hide_on_index"
              :disabled="disabled"
              horizontal
              label="Ukryj na stronie głównej"
            />
          </flex-input>
          <flex-input>
            <switch-input
              v-model="form.public"
              :disabled="disabled"
              horizontal
              label="Widoczność kolekcji"
            />
          </flex-input>
        </div>
      </modal-form>
      <template #footer>
        <div class="row">
          <vs-button v-if="!disabled" color="dark" @click="handleSubmit(saveModal)">
            Zapisz
          </vs-button>
          <pop-confirm
            v-if="deletable"
            v-slot="{ open }"
            title="Czy na pewno chcesz usunąć tę kolekcję? Wraz z nią usuniesz wszystkie jej subkolekcje!"
            ok-text="Usuń"
            cancel-text="Anuluj"
            @confirm="deleteItem"
          >
            <vs-button v-if="form.id" color="danger" @click="open">Usuń</vs-button>
          </pop-confirm>
        </div>
      </template>
    </a-modal>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import slugify from 'slugify'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'

import ModalForm from '@/components/form/ModalForm.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'

import { ProductSetDTO } from '@/interfaces/ProductSet'

export default Vue.extend({
  components: {
    ModalForm,
    PopConfirm,
    FlexInput,
    ValidationObserver,
    SwitchInput,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductSetDTO>,
    slugPrefix: {
      type: String,
      default: '',
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    deletable: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    form: {} as ProductSetDTO,
  }),
  watch: {
    value(value: ProductSetDTO) {
      this.form = cloneDeep(value)
    },
  },
  methods: {
    editSlug() {
      if (!this.form.id) {
        this.form.slug_suffix = slugify(this.form.name, { lower: true, remove: /[.]/g })
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.form.id) {
        await this.$accessor.productSets.update({
          id: this.form.id,
          item: this.form,
        })
      } else {
        await this.$accessor.productSets.add(this.form)
      }
      this.$accessor.stopLoading()
      this.$emit('close')
    },
    async deleteItem() {
      if (!this.form.id) return
      this.$accessor.startLoading()
      await this.$accessor.productSets.remove(this.form.id)
      this.$accessor.stopLoading()
      this.$emit('close')
    },
  },
})
</script>

<style lang="scss">
.product-set-form {
  .switches {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 0 10px;
  }

  .slug-input {
    display: flex;
    align-items: center;

    &__prefix {
      font-size: 0.85em;
      white-space: nowrap;
    }

    &__input {
      width: 100%;

      > * {
        margin-bottom: 0 !important;
      }
    }

    &__switch {
      width: 130px;
      margin-top: -20px;
      margin-left: 10px;
      text-align: center;
    }
  }
}
</style>

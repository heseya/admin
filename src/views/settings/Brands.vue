<template>
  <div>
    <PaginatedList title="Marki" storeKey="brands" draggable>
      <template #nav>
        <vs-button @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>
      <template v-slot="{ item: brand }">
        <list-item @click="openModal(brand.id)" :hidden="!brand.public">
          {{ brand.name }}
          <small>/{{ brand.slug }}</small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja marki' : 'Nowa marka' }}</h4>
        </template>
        <modal-form>
          <validated-input
            rules="required"
            v-model="editedItem.name"
            @input="editSlug"
            label="Nazwa"
          />
          <validated-input rules="required|slug" v-model="editedItem.slug" label="Link" />
          <div class="switches">
            <flex-input>
              <switch-input horizontal v-model="editedItem.public" label="Widoczność marki" />
            </flex-input>
            <flex-input>
              <switch-input
                horizontal
                v-model="editedItem.hide_on_index"
                label="Ukryj na stronie głównej"
              />
            </flex-input>
          </div>
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć tę markę?"
              okText="Usuń"
              cancelText="Anuluj"
              @confirm="deleteItem"
              v-slot="{ open }"
            >
              <vs-button v-if="editedItem.id" color="danger" @click="open">Usuń</vs-button>
            </pop-confirm>
          </div>
        </template>
      </vs-dialog>
    </validation-observer>
  </div>
</template>

<script>
import slugify from 'slugify'
import { ValidationObserver } from 'vee-validate'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'
import SwitchInput from '@/components/SwitchInput.vue'

export default {
  components: {
    ListItem,
    ModalForm,
    PopConfirm,
    FlexInput,
    ValidationObserver,
    PaginatedList,
    ValidatedInput,
    SwitchInput,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      name: '',
      slug: '',
      public: true,
      hide_on_index: false,
    },
  }),
  methods: {
    editSlug() {
      if (!this.editedItem.id) {
        this.editedItem.slug = slugify(this.editedItem.name, { lower: true, remove: /[.]/g })
      }
    },
    openModal(id) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['brands/getFromListById'](id)
      } else {
        this.editedItem = {
          name: '',
          slug: '',
          public: true,
        }
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$store.dispatch('brands/update', {
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$store.dispatch('brands/add', this.editedItem)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$store.dispatch('brands/remove', this.editedItem.id)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
}
</script>

<style lang="scss" scoped>
.switches {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 10px;
}
</style>

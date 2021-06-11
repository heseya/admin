<template>
  <div>
    <ItemsPaginatedList title="Marki" storeKey="brands" draggable>
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
    </ItemsPaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja marki' : 'Nowa marka' }}</h4>
        </template>
        <modal-form>
          <validation-provider rules="required" v-slot="{ errors }">
            <vs-input v-model="editedItem.name" @input="editSlug" label="Nazwa">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <validation-provider rules="required|slug" v-slot="{ errors }">
            <vs-input v-model="editedItem.slug" label="Link">
              <template #message-danger>{{ errors[0] }}</template>
            </vs-input>
          </validation-provider>
          <div class="switches">
            <flex-input>
              <label class="title">Widoczność marki</label>
              <vs-switch success v-model="editedItem.public">
                <template #off>
                  <i class="bx bx-x"></i>
                </template>
                <template #on>
                  <i class="bx bx-check"></i>
                </template>
              </vs-switch>
            </flex-input>

            <flex-input>
              <label class="title">Ukryj na stronie głównej</label>
              <vs-switch success v-model="editedItem.hide_on_index">
                <template #off>
                  <i class="bx bx-x"></i>
                </template>
                <template #on>
                  <i class="bx bx-check"></i>
                </template>
              </vs-switch>
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
import { ValidationProvider, ValidationObserver } from 'vee-validate'

import ItemsPaginatedList from '@/components/ItemsPaginatedList.vue'
import ModalForm from '@/components/ModalForm.vue'
import ListItem from '@/components/ListItem.vue'
import FlexInput from '@/components/FlexInput.vue'
import PopConfirm from '@/components/PopConfirm.vue'

export default {
  components: {
    ListItem,
    ModalForm,
    PopConfirm,
    FlexInput,
    ValidationProvider,
    ValidationObserver,
    ItemsPaginatedList,
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
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('brands/update', {
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$store.dispatch('brands/add', this.editedItem)
      }
      loading.close()
      this.isModalActive = false
    },
    async deleteItem() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('brands/remove', this.editedItem.id)
      loading.close()
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

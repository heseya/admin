<template>
  <div>
    <top-nav title="Marki">
      <vs-button @click="openModal()" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!brands.length">Nie ma żadnej marki</app-empty>
      <list>
        <draggable v-model="brands">
          <list-item
            v-for="brand in brands"
            :key="brand.id"
            @click="openModal(brand.id)"
            :hidden="!brand.public"
          >
            {{ brand.name }}
            <small>/{{ brand.slug }}</small>
          </list-item>
        </draggable>
      </list>
    </card>

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
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ModalForm from '@/components/ModalForm.vue'
import ListItem from '@/components/ListItem.vue'
import FlexInput from '@/components/FlexInput.vue'
import Empty from '@/components/Empty.vue'
import PopConfirm from '@/components/PopConfirm.vue'
import Draggable from 'vuedraggable'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    ModalForm,
    PopConfirm,
    FlexInput,
    appEmpty: Empty,
    ValidationProvider,
    ValidationObserver,
    Draggable,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      name: '',
      slug: '',
      public: true,
      hide_on_index: false,
    }
  }),
  computed: {
    brands: {
      get() {
        return this.$store.getters['brands/getData']
      },
      async set(val) {
        const loading = this.$vs.loading({ color: '#000' })
        await this.$store.dispatch('brands/setOrder', val.map((brand) => brand.id))
        await this.$store.dispatch('brands/fetch')
        loading.close()
      }
    },
    error() {
      return this.$store.getters['brands/getError']
    }
  },
  watch: {
    error(error) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          title: error.message,
          text: error.response.data?.error?.message
        })
      }
    }
  },
  methods: {
    async getBrands() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('brands/fetch')
      loading.close()
    },
    editSlug() {
      this.editedItem.slug = slugify(this.editedItem.name, { lower: true, remove: /[.]/g })
    },
    openModal(id) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['brands/getFromListById'](id)
      } else {
        this.editedItem = {
          name: '',
          slug: '',
          public: true
        }
      }
    },
    async saveModal() {
      const loading = this.$vs.loading({ color: '#000' })
      if (this.editedItem.id) {
        await this.$store.dispatch('brands/update', {
          id: this.editedItem.id,
          item: this.editedItem
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
    }
  },
  created() {
    this.getBrands()
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  }
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

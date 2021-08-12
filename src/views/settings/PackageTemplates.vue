<template>
  <div>
    <PaginatedList title="Szablony przesyłek" storeKey="packageTemplates">
      <template #nav>
        <vs-button @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>
      <template v-slot="{ item: packageTemplate }">
        <list-item @click="openModal(packageTemplate.id)">
          {{ packageTemplate.name }}
          <small>
            waga: <b>{{ packageTemplate.weight }}kg</b>, wysokość:
            <b>{{ packageTemplate.height }}cm</b>, szerokość: <b>{{ packageTemplate.width }}cm</b>,
            głębokość: <b>{{ packageTemplate.depth }}cm</b>
          </small>
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja szablony' : 'Nowy szablon' }}</h4>
        </template>
        <modal-form>
          <validated-input rules="required" v-model="editedItem.name" label="Nazwa" />

          <validated-input
            rules="required|positive"
            v-model="editedItem.weight"
            type="number"
            step="0.01"
            label="Waga (kg)"
          />

          <validated-input
            rules="required|positive"
            v-model="editedItem.width"
            type="number"
            label="Szerokość (cm)"
          />

          <validated-input
            rules="required|positive"
            v-model="editedItem.height"
            type="number"
            label="Wysokość (cm)"
          />

          <validated-input
            rules="required|positive"
            v-model="editedItem.depth"
            type="number"
            label="Głębokość (cm)"
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć ten szablon dostawy?"
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

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { clone } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import ListItem from '@/components/layout/ListItem.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { ID } from '@/interfaces/ID'
import { PackageTemplate } from '@/interfaces/PackageTemplate'

const CLEAR_PACKAGE_TEMPALTE: PackageTemplate = {
  id: '',
  name: '',
  width: 0,
  height: 0,
  depth: 0,
  weight: 0,
}

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    ValidatedInput,
  },
  data: () => ({
    isModalActive: false,
    editedItem: clone(CLEAR_PACKAGE_TEMPALTE),
  }),
  methods: {
    openModal(id?: ID) {
      this.isModalActive = true
      if (id) {
        const item = this.$accessor.packageTemplates.getFromListById(id)
        this.editedItem = clone(item)
      } else {
        this.editedItem = clone(CLEAR_PACKAGE_TEMPALTE)
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$accessor.packageTemplates.update({
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$accessor.packageTemplates.add(this.editedItem)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.packageTemplates.remove(this.editedItem.id)
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
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
}
</style>

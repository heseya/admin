<template>
  <div class="narrower-page">
    <PaginatedList title="Szablony przesyłek" store-key="packageTemplates">
      <template #nav>
        <icon-button v-can="$p.Packages.Add" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          Dodaj szablon
        </icon-button>
      </template>
      <template #default="{ item: packageTemplate }">
        <list-item :key="packageTemplate.id" @click="openModal(packageTemplate.id)">
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
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? 'Edycja szablony' : 'Nowy szablon'"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.name"
            :disabled="!canModify"
            rules="required"
            label="Nazwa"
          />

          <validated-input
            v-model="editedItem.weight"
            :disabled="!canModify"
            rules="required|positive"
            type="number"
            step="0.01"
            label="Waga (kg)"
          />

          <validated-input
            v-model="editedItem.width"
            :disabled="!canModify"
            rules="required|positive"
            type="number"
            label="Szerokość (cm)"
          />

          <validated-input
            v-model="editedItem.height"
            :disabled="!canModify"
            rules="required|positive"
            type="number"
            label="Wysokość (cm)"
          />

          <validated-input
            v-model="editedItem.depth"
            :disabled="!canModify"
            rules="required|positive"
            type="number"
            label="Głębokość (cm)"
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)"> Zapisz </app-button>
            <pop-confirm
              v-can="$p.Packages.Remove"
              title="Czy na pewno chcesz usunąć ten szablon dostawy?"
              ok-text="Usuń"
              cancel-text="Anuluj"
              @confirm="deleteItem"
            >
              <app-button v-if="editedItem.id" type="danger">Usuń</app-button>
            </pop-confirm>
          </div>
        </template>
      </a-modal>
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

import { UUID } from '@/interfaces/UUID'
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
  metaInfo: { title: 'Szablony przesyłek' },
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
  data: () => ({
    isModalActive: false,
    editedItem: clone(CLEAR_PACKAGE_TEMPALTE),
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Packages.Edit : this.$p.Packages.Add)
    },
  },
  methods: {
    openModal(id?: UUID) {
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
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
}
</style>

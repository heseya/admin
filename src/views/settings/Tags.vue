<template>
  <div>
    <PaginatedList title="Tagi" store-key="tags">
      <template #nav>
        <icon-button v-can="$p.Tags.Add" @click="openModal()">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj tag
        </icon-button>
      </template>
      <template #default="{ item: tag }">
        <list-item :key="tag.id" @click="openModal(tag.id)">
          <template #avatar>
            <avatar :key="tag.color" :color="`#${tag.color}`" />
          </template>
          {{ tag.name }}
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal
        v-model="isModalActive"
        width="550px"
        :title="editedItem.id ? 'Edycja taga' : 'Nowy tag'"
      >
        <modal-form>
          <validated-input
            v-model="editedItem.name"
            :disabled="!canModify"
            rules="required"
            label="Nazwa"
          />

          <validated-input
            :disabled="!canModify"
            rules="required"
            :value="`#${editedItem.color}`"
            label="Kolor"
            type="color"
            @input="setColor"
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button v-if="canModify" @click="handleSubmit(saveModal)"> Zapisz </app-button>
            <pop-confirm
              v-can="$p.Tags.Remove"
              title="Czy na pewno chcesz usunąć ten tag?"
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
import Avatar from '@/components/layout/Avatar.vue'

import { UUID } from '@/interfaces/UUID'
import { Tag } from '@/interfaces/Tag'

const CLEAR_TAG: Tag = {
  id: '',
  name: '',
  color: '000000',
}

export default Vue.extend({
  metaInfo: { title: 'Tagi' },
  components: {
    PaginatedList,
    ListItem,
    ModalForm,
    PopConfirm,
    ValidationObserver,
    Avatar,
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
    editedItem: clone(CLEAR_TAG) as Tag,
  }),
  computed: {
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Tags.Edit : this.$p.Tags.Add)
    },
  },
  methods: {
    setColor(color: string) {
      this.editedItem.color = color.split('#')[1] ?? color
    },
    openModal(id?: UUID) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$accessor.tags.getFromListById(id)
        this.setColor(this.editedItem.color)
      } else {
        this.editedItem = clone(CLEAR_TAG)
      }
    },
    async saveModal() {
      this.$accessor.startLoading()
      if (this.editedItem.id) {
        await this.$accessor.tags.update({
          id: this.editedItem.id,
          item: this.editedItem,
        })
      } else {
        await this.$accessor.tags.add(this.editedItem)
      }
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
    async deleteItem() {
      this.$accessor.startLoading()
      await this.$accessor.tags.remove(this.editedItem.id)
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
})
</script>

<style lang="scss">
input[type='color'] {
  height: 30px !important;
}
</style>

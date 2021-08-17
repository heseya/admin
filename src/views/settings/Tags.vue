<template>
  <div>
    <PaginatedList title="Tagi" storeKey="tags">
      <template #nav>
        <vs-button v-can="$p.Tags.Add" @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>
      <template v-slot="{ item: tag }">
        <list-item @click="openModal(tag.id)" :key="tag.id">
          <template #avatar>
            <vs-avatar :color="`#${tag.color}`" :key="tag.color" />
          </template>
          {{ tag.name }}
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>{{ editedItem.id ? 'Edycja taga' : 'Nowy tag' }}</h4>
        </template>
        <modal-form>
          <validated-input rules="required" v-model="editedItem.name" label="Nazwa" />

          <validated-input
            rules="required"
            :value="`#${editedItem.color}`"
            label="Kolor"
            @input="setColor"
            type="color"
          />
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Zapisz</vs-button>
            <pop-confirm
              title="Czy na pewno chcesz usunąć ten tag?"
              v-can="$p.Tags.Remove"
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

import { UUID } from '@/interfaces/UUID'
import { Tag } from '@/interfaces/Tag'

const CLEAR_TAG: Tag = {
  id: '',
  name: '',
  color: '000000',
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
    editedItem: clone(CLEAR_TAG) as Tag,
  }),
  methods: {
    setColor(color: string) {
      this.editedItem.color = color.split('#')[1] ?? color
    },
    openModal(id?: UUID) {
      if (!this.$verboseCan([this.$p.Tags.Add, this.$p.Tags.Edit])) return

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

<style lang="scss">
input[type='color'] {
  height: 30px !important;
}
</style>

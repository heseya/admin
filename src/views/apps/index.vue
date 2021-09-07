<template>
  <div>
    <PaginatedList title="Aplikacje" store-key="apps">
      <template #nav>
        <icon-button @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          Dodaj aplikacje
        </icon-button>
      </template>

      <template v-slot="{ item: app }">
        <list-item no-hover>
          <template #avatar>
            <avatar> <i class="bx bxs-extension"></i> </avatar>
          </template>
          {{ app.name }}
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal v-model="isModalActive" width="550px" title="Dodaj Aplikacje">
        <modal-form>
          <validated-input v-model="editedItem.url" rules="required" label="URL" />
        </modal-form>
        <template #footer>
          <div class="row">
            <app-button @click="handleSubmit(saveModal)">Dodaj</app-button>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import ListItem from '@/components/layout/ListItem.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import Avatar from '@/components/layout/Avatar.vue'

export default Vue.extend({
  metaInfo: { title: 'Aplikacje' },
  components: {
    ListItem,
    ModalForm,
    ValidationObserver,
    PaginatedList,
    Avatar,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {
      url: '',
    },
  }),
  methods: {
    openModal() {
      this.isModalActive = true
    },
    async saveModal() {
      this.$accessor.startLoading()
      await this.$accessor.apps.add(this.editedItem)
      // await this.$accessor.apps.fetch()
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
})
</script>

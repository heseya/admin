<template>
  <div>
    <PaginatedList title="Aplikacje" storeKey="apps">
      <template #nav>
        <vs-button @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: app }">
        <list-item no-hover>
          <template #avatar>
            <vs-avatar dark>
              <i class="bx bxs-extension"></i>
            </vs-avatar>
          </template>
          {{ app.name }}
        </list-item>
      </template>
    </PaginatedList>

    <validation-observer v-slot="{ handleSubmit }">
      <vs-dialog width="550px" not-center v-model="isModalActive">
        <template #header>
          <h4>Dodaj Aplikacje</h4>
        </template>
        <modal-form>
          <validated-input rules="required" v-model="editedItem.url" label="URL" />
        </modal-form>
        <template #footer>
          <div class="row">
            <vs-button color="dark" @click="handleSubmit(saveModal)">Dodaj</vs-button>
          </div>
        </template>
      </vs-dialog>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import ListItem from '@/components/layout/ListItem.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

export default Vue.extend({
  components: {
    ListItem,
    ModalForm,
    ValidationObserver,
    PaginatedList,
    ValidatedInput,
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

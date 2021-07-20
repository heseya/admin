<template>
  <div>
    <PaginatedList title="Aplikacje" storeKey="apps">
      <template #nav>
        <vs-button @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: app }">
        <list-item class="app">
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

<script>
import ListItem from '@/components/layout/ListItem.vue'
import { ValidationObserver } from 'vee-validate'
import ModalForm from '@/components/ModalForm'
import PaginatedList from '@/components/PaginatedList.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

export default {
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
      await this.$store.dispatch('apps/add', this.editedItem)
      await this.$store.dispatch('apps/fetch')
      this.$accessor.stopLoading()
      this.isModalActive = false
    },
  },
}
</script>

<style lang="scss" scoped>
.app {
  cursor: default;

  &:hover {
    background: none;
  }
}
</style>

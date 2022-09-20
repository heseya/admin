<template>
  <validation-observer v-slot="{ handleSubmit }">
    <a-modal :visible="visible" width="600px" @cancel="close">
      <template #title> {{ isNew ? $t('newTitle') : $t('editTitle') }} </template>

      <modal-form>
        <validated-input
          v-model="form.name"
          name="name"
          type="input"
          rules="required"
          :label="$t('common.form.name')"
        />

        <AppTextarea
          v-model="form.description"
          name="description"
          rules="required"
          :label="$t('form.description')"
        />
      </modal-form>
      <template #footer>
        <div class="row">
          <app-button html-type="button" type="white" data-cy="cancel-btn" @click="close">
            {{ $t('common.cancel') }}
          </app-button>
          <app-button data-cy="save-btn" type="primary" @click="handleSubmit(saveB2BCompany)">
            {{ isNew ? $t('common.add') : $t('common.save') }}
          </app-button>
        </div>
      </template>
    </a-modal>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Dodaj firmę",
    "editTitle": "Edytuj firmę",
    "form": {
      "name": "Nazwa firmy",
      "description": "Opis (opcjonalnie)"
    },
    "alerts": {
      "created": "Firma została dodana",
      "updated": "Firma została zaktualizowana"
    }
  },
  "en": {
    "newTitle": "Add company",
    "editTitle": "Edit company",
    "form": {
      "name": "Company name",
      "description": "Description (optional)"
    },
    "alerts": {
      "created": "Company has been added",
      "updated": "Company has been updated"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { Role, RoleCreateDto } from '@heseya/store-core'
import { cloneDeep } from 'lodash'

import ModalForm from '@/components/form/ModalForm.vue'
import AppTextarea from '@/components/form/Textarea.vue'

const CLEAR_FORM: RoleCreateDto = {
  name: '',
  description: '',
  permissions: [],
  metadata: {
    b2b_company: true,
  },
}

export default Vue.extend({
  components: { ValidationObserver, ModalForm, AppTextarea },
  props: {
    initialValue: {
      type: Object,
      default: () => null,
    } as Vue.PropOptions<Partial<Role> | null>,
    visible: { type: Boolean, default: false },
  },

  data: () => ({
    form: cloneDeep(CLEAR_FORM) as RoleCreateDto,
  }),

  computed: {
    isNew(): boolean {
      return !this.initialValue?.id
    },
  },

  watch: {
    visible: {
      immediate: true,
      handler(visible) {
        if (visible) {
          this.form = { ...cloneDeep(CLEAR_FORM), ...cloneDeep(this.initialValue) }
        }
      },
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async saveB2BCompany() {
      this.$accessor.startLoading()
      const success = this.initialValue?.id
        ? await this.$accessor.b2bCompanies.update({ id: this.initialValue.id, item: this.form })
        : await this.$accessor.b2bCompanies.add(this.form)
      this.$accessor.stopLoading()

      if (success) {
        if (this.isNew) this.$toast.success(this.$t('alerts.created') as string)
        else this.$toast.success(this.$t('alerts.updated') as string)
        this.$emit('saved', success)
        this.close()
      }
    },
  },
})
</script>

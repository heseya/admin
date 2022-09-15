<template>
  <validation-observer v-slot="{ handleSubmit }">
    <a-modal :visible="visible" width="600px" @cancel="close">
      <template #title> {{ $t('newTitle') }} </template>

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
          <app-button data-cy="save-btn" type="primary" @click="handleSubmit(createB2BCompany)">
            {{ $t('common.add') }}
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
    "form": {
      "name": "Nazwa firmy",
      "description": "Opis (opcjonalnie)"
    },
    "alerts": {
      "created": "Firma została dodana"
    }
  },
  "en": {
    "newTitle": "Add company",
    "form": {
      "name": "Company name",
      "description": "Description (optional)"
    },
    "alerts": {
      "created": "Company has been added"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { RoleCreateDto } from '@heseya/store-core'
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
    visible: { type: Boolean, default: false },
  },

  data: () => ({
    form: cloneDeep(CLEAR_FORM) as RoleCreateDto,
  }),

  watch: {
    visible: {
      immediate: true,
      handler(visible) {
        if (!visible) {
          this.form = cloneDeep(CLEAR_FORM)
        }
      },
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async createB2BCompany() {
      this.$accessor.startLoading()
      const success = await this.$accessor.b2bCompanies.add(this.form)
      this.$accessor.stopLoading()

      if (success) {
        this.$toast.success(this.$t('alerts.created') as string)
        this.close()
      }
    },
  },
})
</script>

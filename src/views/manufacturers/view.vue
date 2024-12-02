<template>
  <div class="manufacture-view narrower-page">
    <top-nav
      :title="
        !isNew
          ? `${manufacturer.name ? `${manufacturer.name} - ` : ''} ${manufacturer.email}`
          : $t('newTitle').toString()
      "
    >
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Manufacturers.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deleteManufacture"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="coupon-view__form">
      <validation-observer v-slot="{ handleSubmit }">
        <card>
          <ManufacturesForm v-model="form" :disabled="!canModify" />

          <hr />
          <app-button v-if="canModify" @click="handleSubmit(save)">
            {{ $t('common.save') }}
          </app-button>
        </card>
      </validation-observer>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "newTitle": "New manufacture",
    "deleteText": "Are you sure, you want to delete this manufacture?",
    "alerts": {
      "deleted": "Manufacture has been deleted",
      "created": "Manufacture has been created",
      "updated": "Manufacture has been updated"
    },
    "formCode": "Code"
  },
  "pl": {
    "newTitle": "Nowy Producent",
    "deleteText": "Jesteś pewien, że chcesz usunąć tego producenta?",
    "alerts": {
      "deleted": "Producent został usunięty",
      "created": "Producent został utworzony",
      "updated": "Producent został zaktualizowany"
    },
    "formCode": "Kod"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'
import { Manufacturer, ManufacturerDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import ManufacturesForm, { ManufacturerForm } from '@/components/modules/manufacturers/Form.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'

import { UUID } from '@/interfaces/UUID'

import { formatApiNotificationError } from '@/utils/errors'

const EMPTY_MANUFACTURE_FORM: ManufacturerDto = {
  name: '',
  first_name: '',
  last_name: '',
  email: '',
  address: {
    address: '',
    city: '',
    country: '',
    country_name: '',
    name: '',
    phone: '',
    vat: '',
    zip: '',
  },
  product_ids: [],
}

export default defineComponent({
  components: {
    ValidationObserver,
    TopNav,
    Card,
    PopConfirm,
    ManufacturesForm,
  },
  metaInfo(this: any): any {
    return {
      title: (!this.isNew && this.manufacture?.name) || (this.$t('newTitle') as string),
    }
  },
  data: () => ({
    form: cloneDeep(EMPTY_MANUFACTURE_FORM) as ManufacturerForm,
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    manufacturer(): Manufacturer {
      return this.$accessor.manufacturers.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.manufacturers.getError
    },
    isLoading(): boolean {
      return this.$accessor.manufacturers.isLoading
    },
    canModify(): boolean {
      return this.$can(this.isNew ? this.$p.Manufacturers.Add : this.$p.Manufacturers.Edit)
    },
  },
  watch: {
    manufacturer(manufacturer: Manufacturer) {
      if (!this.isNew) {
        this.form = cloneDeep({
          ...EMPTY_MANUFACTURE_FORM,
          ...manufacturer,
        }) as ManufacturerDto
      }
    },
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  async created() {
    if (!this.isNew) {
      this.$accessor.startLoading()
      await this.$accessor.manufacturers.get(this.id)
      this.$accessor.stopLoading()
    }
  },

  methods: {
    async save() {
      this.$accessor.startLoading()
      const dto = this.form
      if (this.isNew) {
        const manufacture = await this.$accessor.manufacturers.add(dto)
        if (manufacture && manufacture.id) {
          this.$toast.success(this.$t('alerts.created') as string)
          this.$router.push(`/manufacturers/${manufacture.id}`)
        }
      } else {
        const success = await this.$accessor.manufacturers.update({
          id: this.id,
          item: dto,
        })
        if (success) {
          this.$toast.success(this.$t('alerts.updated') as string)
        }
      }
      this.$accessor.stopLoading()
    },

    async deleteManufacture() {
      this.$accessor.startLoading()
      const success = await this.$accessor.manufacturers.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('alerts.deleted') as string)
        this.$router.push('/manufacturers')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
.manufacture-view {
  &__code {
    display: flex;
  }
}
</style>

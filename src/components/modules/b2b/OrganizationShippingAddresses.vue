<template>
  <card class="org-shipping-addresses">
    <top-nav tag="h2" :title="$t('title').toString()" class="org-shipping-addresses__nav">
      <icon-button size="small" type="primary" @click="openEditAddressModal(null)">
        <template #icon> <i class="bx bx-plus"></i> </template>
        {{ $t('add') }}
      </icon-button>
    </top-nav>

    <div class="org-shipping-addresses__list">
      <div v-for="address in addresses" :key="address.id" class="address-item">
        <icon-button
          type="transparent"
          class="address-item__edit-btn"
          @click="openEditAddressModal(address)"
        >
          <template #icon> <i class="bx bx-edit-alt"></i> </template>
        </icon-button>

        <div class="address-item__name">
          {{ address.name }}
          <tag v-if="address.default" small type="success">
            {{ $t('default') }}
          </tag>
        </div>

        <div>
          <span>{{ address.address.name }}</span> <br />
          <span>{{ address.address.address }}</span> <br />
          <span>{{ address.address.zip }} {{ address.address.city }}</span> <br />
          <span>{{ address.address.country_name }}</span> <br />
          <span>{{ address.address.phone }}</span>
        </div>
      </div>
    </div>

    <validation-observer v-slot="{ handleSubmit }">
      <a-modal :visible="!!editedAddress" width="600px" @cancel="editedAddress = null">
        <template #title> {{ !editedAddress?.id ? $t('newTitle') : $t('editTitle') }} </template>

        <Loading :active="isModalLoading"></Loading>

        <ModalForm v-if="editedAddress">
          <validated-input
            v-model="editedAddress.name"
            name="name"
            type="input"
            rules="required"
            :label="$t('common.form.name').toString()"
          />
          <switch-input
            key="default"
            v-model="editedAddress.default"
            horizontal
            :label="$t('common.default').toString()"
          />
          <hr />
          <AddressForm v-model="editedAddress.address" hide-vat />
        </ModalForm>
        <template #footer>
          <div class="row">
            <app-button
              html-type="button"
              type="white"
              data-cy="cancel-btn"
              @click="editedAddress = null"
            >
              {{ $t('common.cancel') }}
            </app-button>
            <app-button data-cy="save-btn" type="primary" @click="handleSubmit(saveAddress)">
              {{ !editedAddress?.id ? $t('common.add') : $t('common.save') }}
            </app-button>
          </div>
        </template>
      </a-modal>
    </validation-observer>
  </card>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Adresy dostawy",
    "addressesFetchError": "Wystąpił błąd podczas pobierania adresów dostawy",
    "updateError": "Wystąpił błąd podczas zapisywania adresu",
    "default": "Domyślny",
    "add": "Dodaj adres",
    "newTitle": "Dodaj adres",
    "editTitle": "Edytuj adres"
  },
  "en": {
    "title": "Shipping Addresses",
    "addressesFetchError": "An error occurred while fetching shipping addresses",
    "updateError": "An error occurred while saving address",
    "default": "Default",
    "add": "Add address",
    "newTitle": "Add address",
    "editTitle": "Edit address"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import { Organization, OrganizationSavedAddress } from '@heseya/store-core'

import ModalForm from '@/components/form/ModalForm.vue'
import Card from '@/components/layout/Card.vue'
import TopNav from '@/components/layout/TopNav.vue'
import AddressForm from '@/components/modules/orders/AddressForm.vue'
import Loading from '@/components/layout/Loading.vue'

import { sdk } from '@/api'

export default defineComponent({
  components: { TopNav, Card, AddressForm, ValidationObserver, ModalForm, Loading },
  props: {
    organization: {
      type: Object as PropType<Organization>,
      required: true,
    },
  },

  data: () => ({
    isModalLoading: false,
    isLoading: false,
    addresses: [] as OrganizationSavedAddress[],
    editedAddress: null as OrganizationSavedAddress | null,
  }),

  watch: {
    organization: {
      immediate: true,
      async handler() {
        this.isLoading = true
        try {
          const { data: addresses } = await sdk.Organizations.ShippingAddresses.get(
            this.organization.id,
          )
          this.addresses = addresses as any
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
          this.$toast.error(this.$t('addressesFetchError') as string)
        }

        // TODO: remove mock
        if (!this.addresses.length)
          this.addresses = [
            {
              id: 'asdas',
              default: true,
              name: 'Nazwa adresu',
              address: {
                address: 'Ulicowa 15',
                city: 'Warszawa',
                country: 'PL',
                country_name: 'Polska',
                name: 'Firma A',
                phone: '222 333 444',
                zip: '22-222',
              },
            },
          ]

        this.isLoading = false
      },
    },
  },

  methods: {
    openEditAddressModal(address: OrganizationSavedAddress | null) {
      this.editedAddress = address
        ? cloneDeep(address)
        : {
            id: '',
            name: '',
            default: false,
            address: {
              name: '',
              address: '',
              city: '',
              zip: '',
              country: '',
              country_name: '',
              phone: '',
            },
          }
    },

    async saveAddress() {
      if (!this.editedAddress) return
      this.isModalLoading = true

      try {
        if (this.editedAddress?.id) {
          const updatedAddress = await sdk.Organizations.ShippingAddresses.update(
            this.organization.id,
            this.editedAddress.id,
            this.editedAddress,
          )

          // update
          if (updatedAddress.default)
            this.addresses = this.addresses.map((address) => ({ ...address, default: false }))
          this.addresses = this.addresses.map((address) =>
            address.id === updatedAddress.id ? updatedAddress : address,
          )
        } else {
          const createdAddress = await sdk.Organizations.ShippingAddresses.add(
            this.organization.id,
            this.editedAddress,
          )

          if (createdAddress.default)
            this.addresses = this.addresses.map((address) => ({ ...address, default: false }))
          this.addresses.push(createdAddress)
        }

        this.editedAddress = null
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        this.$toast.error(this.$t('updateError').toString())
      }
      this.isModalLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.org-shipping-addresses {
  position: relative;

  &__nav {
    margin-bottom: 8px;
  }

  &__list {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr;
    margin-bottom: 12px;

    @media ($viewport-4) {
      grid-template-columns: 1fr 1fr;
    }

    @media ($viewport-7) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media ($viewport-14) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    @media ($viewport-20) {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
  }
}

.address-item {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid var(--background-color-700);
  transition: 0.3s;
  position: relative;

  &__name {
    color: var(--font-color);
    font-size: 1rem;
    font-weight: 500;
  }

  &__edit-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    color: var(--gray-color-500);
    z-index: 10;
  }

  &:hover {
    box-shadow: $shadow;
  }
}
</style>

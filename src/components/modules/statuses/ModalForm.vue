<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <a-modal
      :visible="active"
      width="550px"
      :title="form.id ? $t('editTitle') : $t('newTitle')"
      @cancel="$emit('close')"
    >
      <ModalForm class="order-status-form">
        <validated-input
          v-model="formName"
          :disabled="disabled"
          rules="required"
          :label="$t('common.form.name')"
        />

        <validated-input
          v-model="formDescription"
          :disabled="disabled"
          type="textarea"
          rows="5"
          rules="required"
          :label="$t('common.form.description')"
        />

        <validated-input
          :disabled="disabled"
          rules="required"
          :value="`#${form.color}`"
          :label="$t('form.color')"
          type="color"
          @input="setColor"
        />

        <br />
        <PublishedLangsForm v-model="form.published" />

        <br />

        <SwitchInput
          v-model="form.cancel"
          :disabled="disabled"
          horizontal
          :label="$t('form.cancel').toString()"
        />
        <br />

        <SwitchInput v-model="form.hidden" :disabled="disabled" horizontal>
          <template #title>
            {{ $t('form.hidden') }}
            <info-tooltip>
              {{ $t('form.hiddenTooltip') }}
            </info-tooltip>
          </template>
        </SwitchInput>
        <br />

        <SwitchInput v-model="form.no_notifications" :disabled="disabled" horizontal>
          <template #title>
            {{ $t('form.noNotification') }}
            <info-tooltip>
              {{ $t('form.noNotificationTooltip') }}
            </info-tooltip>
          </template>
        </SwitchInput>

        <template v-if="selectedItem">
          <hr />
          <MetadataForm
            ref="publicMeta"
            :value="selectedItem.metadata"
            :disabled="disabled"
            model="statuses"
          />
          <MetadataForm
            v-if="selectedItem.metadata_private"
            ref="privateMeta"
            :value="selectedItem.metadata_private"
            :disabled="disabled"
            type="private"
            model="statuses"
          />
        </template>

        <ContentLangSwitch :value="editedLang" @input="setEditedLang" />
      </ModalForm>
      <template #footer>
        <div class="row">
          <app-button v-if="!disabled" @click="handleSubmit(saveModal)">
            {{ $t('common.save') }}
          </app-button>
          <pop-confirm
            v-can="$p.Statuses.Remove"
            :title="$t('deleteText').toString()"
            :ok-text="$t('common.delete').toString()"
            :cancel-text="$t('common.cancel').toString()"
            @confirm="deleteItem"
          >
            <app-button v-if="form.id" type="danger">{{ $t('common.delete') }}</app-button>
          </pop-confirm>
        </div>
      </template>
    </a-modal>
  </ValidationObserver>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Statusy zamówień",
    "add": "Dodaj status",
    "editTitle": "Edycja statusu",
    "newTitle": "Nowy status",
    "deleteText": "Czy na pewno chcesz usunąć ten status?",
    "form": {
      "color": "Kolor",
      "cancel": "Przywracanie stanów magazynowych",
      "hidden": "Ukryj zamówienia z tym statusem na liście",
      "hiddenTooltip": "Zamówienia z tym statusem nie będą domyślnie pokazywać się na liście zamówień. Wciąż będzie można po nim filtrować.",
      "noNotification": "Nie wysyłaj powiadomień",
      "noNotificationTooltip": "Przy zmianie statusu zamówienia na ten, klientowi nie zostanie wysłane powiadomienie mailowe."
    },
    "alerts": {
      "deleted": "Status zamówienia został usunięty.",
      "created": "Status zamówienia został dodany.",
      "updated": "Status zamówienia został zaktualizowany."
    }
  },
  "en": {
    "title": "Order statuses",
    "add": "Add status",
    "editTitle": "Edit status",
    "newTitle": "New status",
    "deleteText": "Are you sure you want to delete this status?",
    "form": {
      "color": "Color",
      "cancel": "Restore stock",
      "hidden": "Hide orders with this status on the list",
      "hiddenTooltip": "Orders with this status will not be shown on the list by default. You can still filter by them.",
      "noNotification": "Don't send notifications",
      "noNotificationTooltip": "When changing order status to this one, the customer will not receive a notification email."
    },
    "alerts": {
      "deleted": "Order status has been deleted.",
      "created": "Order status has been added.",
      "updated": "Order status has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import clone from 'lodash/clone'
import { Metadata, OrderStatus, OrderStatusCreateDto } from '@heseya/store-core'

import { TranslationsFromDto } from '@/interfaces/Translations'

import ModalForm from '@/components/form/ModalForm.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import ContentLangSwitch from '@/components/lang/ContentLangSwitch.vue'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'

const CLEAR_STATUS_TRANSLATION: TranslationsFromDto<OrderStatusCreateDto> = {
  name: '',
  description: '',
}

const CLEAR_STATUS: OrderStatusCreateDto = {
  color: '000000',
  cancel: false,
  hidden: false,
  no_notifications: false,
  published: [],
  translations: {},
}

export default defineComponent({
  components: {
    ModalForm,
    PopConfirm,
    ValidationObserver,
    SwitchInput,
    MetadataForm,
    ContentLangSwitch,
    PublishedLangsForm,
  },

  props: {
    active: {
      type: Boolean,
      required: true,
    },
    selectedItem: {
      type: Object as PropType<OrderStatus | null>,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    editedLang: 'pl',
    form: clone(CLEAR_STATUS) as OrderStatusCreateDto & { id?: string },
  }),

  computed: {
    formDescription: {
      get(): string {
        return this.form.translations[this.editedLang]?.description || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].description = value
      },
    },
    formName: {
      get(): string {
        return this.form.translations[this.editedLang]?.name || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].name = value
      },
    },
  },

  watch: {
    selectedItem(item) {
      if (item) this.form = clone(item)
      else this.form = clone(CLEAR_STATUS)

      this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
    },
  },

  methods: {
    setColor(color: string) {
      this.form.color = color.split('#')[1] ?? color
    },

    setEditedLang(langId: string) {
      this.editedLang = langId
      if (!this.form?.translations?.[langId])
        this.$set(this.form.translations, langId, { ...CLEAR_STATUS_TRANSLATION })
    },

    async saveModal() {
      this.$accessor.startLoading()
      if (this.form.id) {
        // Metadata can be saved only after status is created
        const updatedMetadata = await this.saveMetadata(this.form.id)

        this.$accessor.statuses.EDIT_DATA({
          key: 'id',
          value: this.form.id,
          item: updatedMetadata,
        })

        const updatedStatus = await this.$accessor.statuses.update({
          id: this.form.id,
          item: this.form,
        })

        if (updatedStatus) {
          this.$toast.success(this.$t('alerts.updated') as string)
          this.$emit('close')
        }
      } else {
        const success = await this.$accessor.statuses.add(this.form)
        if (success) {
          this.$toast.success(this.$t('alerts.created') as string)
          this.$emit('close')
        }
      }
      this.$accessor.stopLoading()
    },

    async deleteItem() {
      this.$accessor.startLoading()
      const success = await this.$accessor.statuses.remove(this.form.id!)
      if (success) this.$toast.success(this.$t('alerts.deleted') as string)
      this.$accessor.stopLoading()
      this.$emit('close')
    },

    async saveMetadata(id: string) {
      const [publicMetadata, privateMetadata] = await Promise.all([
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
      ])
      const metadata: { metadata?: Metadata; metadata_private?: Metadata } = {}
      if (publicMetadata) metadata.metadata = publicMetadata
      if (privateMetadata) metadata.metadata_private = privateMetadata
      return metadata
    },
  },
})
</script>

<style lang="scss" scoped>
.order-status-form {
  input[type='color'] {
    height: 30px !important;
  }
}
</style>

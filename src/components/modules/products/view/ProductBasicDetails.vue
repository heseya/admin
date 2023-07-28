<template>
  <div class="product-basic-details">
    <validated-input
      v-model="formName"
      rules="required"
      :label="$t('common.form.name').toString()"
      name="name"
      :disabled="disabled"
      @input="editSlug"
    />

    <ProductSetSelect v-model="form.sets" :product="product" :disabled="disabled" />

    <validated-input
      v-model="form.slug"
      rules="required|slug"
      :label="$t('common.form.slug').toString()"
      name="slug"
      :disabled="disabled"
    />

    <div class="product-basic-details__price-row">
      <validated-input
        v-model="form.price"
        rules="required|not-negative"
        type="number"
        step="0.01"
        :label="$t('form.price').toString()"
        name="price"
        :disabled="disabled"
      />

      <validated-input
        v-model="form.vat_rate"
        rules="not-negative|less-than:100"
        type="number"
        :label="$t('form.vatRate').toString()"
        name="vat_rate"
        :min="0"
        :disabled="disabled"
      />
    </div>

    <TagsSelect v-model="form.tags" :disabled="disabled" />

    <AppTextarea
      v-if="!loading"
      v-model="formDescriptionShort"
      :label="$t('form.shortDescription').toString()"
      :disabled="disabled"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "price": "Cena brutto",
      "vatRate": "Stawka VAT (%)",
      "shortDescription": "Krótki opis"
    }
  },
  "en": {
    "form": {
      "price": "Price (gross)",
      "vatRate": "VAT rate (%)",
      "shortDescription": "Short description"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'
import ProductSetSelect from '../ProductSetSelect.vue'
import Textarea from '@/components/form/Textarea.vue'
import TagsSelect from '@/components/TagsSelect.vue'

import { generateSlug } from '@/utils/generateSlug'

export default defineComponent({
  components: { ProductSetSelect, AppTextarea: Textarea, TagsSelect },
  props: {
    value: {
      type: Object as PropType<ProductComponentForm>,
      required: true,
    },
    product: {
      type: Object as PropType<Product>,
      default: () => ({} as Product),
    },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    editedLang: { type: String, required: true },
  },
  computed: {
    form: {
      get(): ProductComponentForm {
        return this.value
      },
      set(value: ProductComponentForm) {
        this.$emit('input', value)
      },
    },

    formName: {
      get(): string {
        return this.form.translations?.[this.editedLang]?.name || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].name = value
      },
    },
    formDescriptionShort: {
      get(): string {
        return this.form.translations?.[this.editedLang]?.description_short || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].description_short = value
      },
    },
  },

  methods: {
    editSlug() {
      if (this.isNew) this.form.slug = generateSlug(this.form.name)
    },
  },
})
</script>

<style lang="scss" scoped>
.product-basic-details {
  width: 100%;

  @media ($viewport-14) {
    width: 75%;
  }

  &__price-row {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 0 16px;

    @media ($viewport-4) {
      grid-template-columns: 1.5fr 1fr;
    }

    @media ($viewport-12) {
      width: 80%;
    }
  }
}
</style>

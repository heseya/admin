<template>
  <LayoutAccordion :title="$t('title').toString()">
    <div class="product-banner-form">
      <BannerMediaComponent
        v-if="bannerMedia"
        v-model="bannerMedia"
        :edited-lang="editedLang"
        static
        @delete="bannerMedia = null"
      />

      <Empty v-else>
        {{ $t('empty') }}
        <IconButton type="primary" @click="addBannerMedia">
          <template #icon> <i class="bx bx-plus"></i> </template> {{ $t('addBtn') }}
        </IconButton>
      </Empty>
    </div>
  </LayoutAccordion>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Banner",
    "empty": "Click the button below to add a banner to this product",
    "addBtn": "Add banner"
  },
  "pl": {
    "title": "Banner",
    "empty": "Kliknij przycisk poniżej, aby do tego produktu wyświetlić baner",
    "addBtn": "Dodaj banner"
  }
}
</i18n>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { BannerMedia } from '@heseya/store-core'

import LayoutAccordion from '@/components/layout/Accordion.vue'
import BannerMediaComponent from '@/components/modules/banners/BannerMedia.vue'

import { BannerMediaComponentForm } from '@/interfaces/Banner'
import Empty from '@/components/layout/Empty.vue'
import IconButton from '@/components/layout/IconButton.vue'

export default defineComponent({
  components: { LayoutAccordion, BannerMediaComponent, Empty, IconButton },
  props: {
    value: {
      type: Object as PropType<BannerMedia | null>,
      default: null,
    },
    editedLang: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    bannerMedia: {
      get(): BannerMediaComponentForm | null {
        return this.value ? { translations: {}, ...this.value } : null
      },
      set(bannerMedia: BannerMediaComponentForm | null) {
        this.$emit('input', bannerMedia)
      },
    },
  },

  methods: {
    addBannerMedia() {
      this.bannerMedia = {
        id: '',
        order: 0,
        url: '',
        media: [],
        published: [],
        translations: {
          [this.editedLang]: {
            title: '',
            subtitle: '',
          },
        },
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.product-banner-form {
}
</style>

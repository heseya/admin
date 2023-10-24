<template>
  <validation-observer v-slot="{ handleSubmit }">
    <form class="attachment-form" @submit.prevent="handleSubmit(onSubmit)">
      <loading :active="isLoading" />

      <validated-input
        v-model="form.name"
        name="name"
        :label="$t('common.form.name').toString()"
        rules="required"
      />
      <!--
      <br />
      <small class="label">{{ $t('contentLabel') }}</small>
      <RichEditor v-model="form.content_html" :disabled="disabled" /> -->

      <app-button class="attachment-form__btn" html-type="submit" type="primary">
        {{ $t('common.save') }}
      </app-button>
    </form>
  </validation-observer>
</template>

<i18n lang="json">
{
  "en": {
    "contentLabel": "Content"
  },
  "pl": {
    "contentLabel": "Treść"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { PageCreateDto } from '@heseya/store-core'

import { sdk } from '@/api'
import { formatApiNotificationError } from '@/utils/errors'
import { generateSlug } from '@/utils/generateSlug'

import Loading from '@/components/layout/Loading.vue'
import { TranslationsFromDto } from '@/interfaces/Translations'

// TODO: enable rich editor, now its crashing whole page

const EMPTY_FORM: TranslationsFromDto<PageCreateDto> = {
  name: '',
  content_html: '<div></div>',
}

export default defineComponent({
  components: { ValidationObserver, Loading },
  props: {
    pageId: {
      type: String,
      required: true,
    },
    slugPrefix: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    editedLang: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    showEditor: false,
    isLoading: false,
    form: {
      ...EMPTY_FORM,
    },
  }),

  computed: {
    isNew(): boolean {
      return this.pageId === 'new'
    },
  },

  watch: {
    pageId: {
      handler() {
        this.initForm()
      },
      immediate: true,
    },
  },

  mounted() {
    setTimeout(() => {
      this.showEditor = true
    }, 100)
  },

  methods: {
    async initForm() {
      this.isLoading = true

      if (this.isNew) {
        this.form = { ...EMPTY_FORM }
        this.isLoading = false
        return
      }

      try {
        const page = await sdk.Pages.getOne(this.pageId)
        this.form = {
          name: page.name,
          content_html: page.content_html,
        }
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }

      this.isLoading = false
    },

    async onSubmit() {
      this.isLoading = true
      if (this.isNew) {
        await this.createPage()
      } else {
        await this.updatePage()
      }
      this.isLoading = false
    },

    async createPage() {
      try {
        const page = await sdk.Pages.create({
          slug: `${this.slugPrefix}-${generateSlug(this.form.name)}-${Date.now()}`,
          translations: {
            [this.editedLang]: {
              name: this.form.name,
              content_html: this.form.content_html,
            },
          },
          published: [this.editedLang],
          public: true,
        })

        this.$emit('created', page)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },

    async updatePage() {
      try {
        if (this.isNew) return

        const page = await sdk.Pages.update(this.pageId, {
          slug: `${this.slugPrefix}-${generateSlug(this.form.name)}`,
          published: this.$accessor.languages.data.map((lang) => lang.id),
          translations: {
            [this.editedLang]: {
              name: this.form.name,
              content_html: this.form.content_html,
            },
          },
          public: true,
        })

        this.$emit('updated', page)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.attachment-form {
  &__btn {
    margin: 0 auto;
    margin-top: 16px;
  }

  &__upload {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>

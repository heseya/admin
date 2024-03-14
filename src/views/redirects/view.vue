<template>
  <div class="narrower-page">
    <top-nav :title="!isNew ? redirect.name : $t('newTitle').toString()">
      <pop-confirm
        v-if="!isNew"
        v-can="$p.Redirects.Remove"
        :title="$t('deleteText').toString()"
        :ok-text="$t('common.delete').toString()"
        :cancel-text="$t('common.cancel').toString()"
        @confirm="deletePage"
      >
        <icon-button type="danger">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
          {{ $t('common.delete') }}
        </icon-button>
      </pop-confirm>
    </top-nav>

    <div class="redirect-form">
      <validation-observer v-slot="{ handleSubmit }">
        <card>
          <div class="redirect-form__row">
            <validated-input
              v-model="form.name"
              rules="required"
              :label="$t('common.form.name')"
              :disabled="!canModify"
            />

            <app-select
              v-model="form.type"
              :label="$t('form.type').toString()"
              option-filter-prop="label"
            >
              <a-select-option :value="301" :label="301">
                {{ $t('form.types.301') }}
              </a-select-option>
              <a-select-option :value="302" :label="302">
                {{ $t('form.types.302') }}
              </a-select-option>
              <a-select-option :value="307" :label="307">
                {{ $t('form.types.307') }}
              </a-select-option>
              <a-select-option :value="308" :label="308">
                {{ $t('form.types.308') }}
              </a-select-option>
            </app-select>

            <flex-input>
              <switch-input
                v-model="form.enabled"
                horizontal
                :label="$t('form.enabled').toString()"
                :disabled="!canModify"
              />
            </flex-input>
          </div>

          <p class="redirect-form__info" v-html="$t('information')"></p>

          <validated-input
            v-model="form.source_url"
            rules="required"
            :label="$t('form.sourceUrl')"
            :disabled="!canModify"
          />

          <validated-input
            v-model="form.target_url"
            rules="required"
            :label="$t('form.targetUrl')"
            :disabled="!canModify"
          />

          <br />
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
  "pl": {
    "newTitle": "Nowe przekierowanie",
    "deleteText": "Czy na pewno chcesz usunąć to przekierowanie?",
    "deletedMessage": "Przekierowanie zostało usunięte.",
    "createdMessage": "Przekierowanie zostało utworzone.",
    "updatedMessage": "Przekierowanie zostało zaktualizowane.",
    "information": "Linki przekierowań powinny być relatywne, nie powinny zawierać nazwy domenowej. Przykład: <code>/stara-strona</code>. <br /> Dodatkowo, linki te mogą zawierać zmienne zawarte w nawiasach {}, np. <code>/stara-strona-{id}</code>.",
    "form": {
      "enabled": "Włączone",
      "sourceUrl": "Adres źródłowy",
      "targetUrl": "Adres docelowy",
      "type": "Kod statusu przekierowania",
      "types": {
        "301": "301 - Przeniesiono na stałe",
        "302": "302 - Przeniesiono tymczasowo",
        "307": "307 - Przeniesiono tymczasowo",
        "308": "308 - Przeniesiono na stałe"
      }
    }
  },
  "en": {
    "newTitle": "New redirect",
    "deleteText": "Are you sure you want to delete this redirect?",
    "deletedMessage": "Redirect has been deleted.",
    "createdMessage": "Redirect has been created.",
    "updatedMessage": "Redirect has been updated.",
    "information": "Redirect links should be relative, they should not contain a domain name. Example: <code>/old-page</code>. <br /> Additionally, these links may contain variables contained in braces {}, eg. <code>/old-page-{id}</code>.",
    "form": {
      "enabled": "Enabled",
      "sourceUrl": "Source URL",
      "targetUrl": "Target URL",
      "type": "Redirect status code",
      "types": {
        "301": "301 - Moved permanently",
        "302": "302 - Moved temporarily",
        "307": "307 - Moved temporarily",
        "308": "308 - Moved permanently"
      }
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { Redirect, RedirectCreateDto } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import FlexInput from '@/components/layout/FlexInput.vue'
import PopConfirm from '@/components/layout/PopConfirm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'

import { formatApiNotificationError } from '@/utils/errors'

import { UUID } from '@/interfaces/UUID'

export default defineComponent({
  metaInfo(this: any) {
    const fallback = this.$t('newTitle') as string
    return {
      title: this.isNew ? fallback : this.redirect?.name || fallback,
    }
  },
  components: {
    TopNav,
    Card,
    FlexInput,
    PopConfirm,
    ValidationObserver,
    SwitchInput,
  },
  data: () => ({
    form: {
      name: '',
      enabled: true,
      source_url: '',
      target_url: '',
      type: 307,
    } as RedirectCreateDto,
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    isNew(): boolean {
      return this.id === 'create'
    },
    redirect(): Redirect {
      return this.$accessor.redirects.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.redirects.getError
    },
    isLoading(): boolean {
      return this.$accessor.redirects.isLoading
    },
    canModify(): boolean {
      return this.$can(this.isNew ? this.$p.Redirects.Add : this.$p.Redirects.Edit)
    },
  },
  watch: {
    redirect(redirect: Redirect) {
      if (!this.isNew) {
        this.form = { ...redirect }
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
      await this.$accessor.redirects.get(this.id)
      this.$accessor.stopLoading()
    }
  },
  methods: {
    async save() {
      this.$accessor.startLoading()

      if (this.isNew) {
        const page = await this.$accessor.redirects.add(this.form)
        if (page && page.id) {
          this.$toast.success(this.$t('createdMessage') as string)
          this.$router.push(`/settings/redirects/${page.id}`)
        }
      } else {
        const success = await this.$accessor.redirects.update({
          id: this.id,
          item: this.form,
        })
        if (success) {
          this.$toast.success(this.$t('updatedMessage') as string)
        }
      }
      this.$accessor.stopLoading()
    },
    async deletePage() {
      this.$accessor.startLoading()
      const success = await this.$accessor.redirects.remove(this.id)
      if (success) {
        this.$toast.success(this.$t('deletedMessage') as string)
        this.$router.push('/settings/redirects')
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss">
.redirect-form {
  &__row {
    width: 100%;
    display: flex;
    align-items: flex-end;

    input {
      width: 100%;
    }

    .app-input {
      margin-bottom: 0;
    }
  }

  &__info {
    padding: 8px;
    border-radius: 4px;
    color: $blue-color-500;
    background-color: $blue-color-200;
    margin: 1em 0;
  }

  @media ($viewport-11) {
    &__row {
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: 20px;
      grid-template-rows: 1fr;
      row-gap: 0;
    }
  }
}
</style>

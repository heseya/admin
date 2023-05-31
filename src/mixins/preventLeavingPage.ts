import { defineComponent } from 'vue'
import i18n from '@/i18n'

/**
 * 1. Component must have 'form' in data object
 * 2. isFormPrefilled should be set to true after form was prefilled
 * 3. The 'form' is deeply watched
 * 4. After form submitting isDirty should be reset
 *  */
export default defineComponent({
  beforeRouteLeave(to, from, next) {
    if (this.confirmStayInDirtyForm()) {
      next(false)
    } else {
      next()
    }
  },

  data: () => ({
    isFormPrefilled: false,
    isDirty: false,
  }),

  watch: {
    form: {
      handler() {
        if (this.isFormPrefilled && !this.isDirty) {
          this.isDirty = true
        }
      },
      deep: true,
    },
  },

  created() {
    window.addEventListener('beforeunload', this.beforeWindowUnload)
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeWindowUnload)
  },

  methods: {
    confirmLeave(): boolean {
      return window.confirm(i18n.t('common.confirmLeave') as string)
    },

    confirmStayInDirtyForm(): boolean {
      return this.isDirty && !this.confirmLeave()
    },

    beforeWindowUnload(e: Event) {
      if (this.confirmStayInDirtyForm()) {
        e.preventDefault()
        // Chrome requires returnValue to be set
        e.returnValue = true
      }
    },
  },
})

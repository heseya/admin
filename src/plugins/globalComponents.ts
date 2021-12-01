import Vue from 'vue'

import AppInput from '@/components/form/AppInput.vue'
import AppSelect from '@/components/form/AppSelect.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import ValidatedSwitchInput from '@/components/form/ValidatedSwitchInput.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

import IconButton from '@/components/layout/IconButton.vue'
import AppButton from '@/components/layout/AppButton.vue'

Vue.component('AppInput', AppInput)
Vue.component('ValidatedInput', ValidatedInput)
Vue.component('AppSelect', AppSelect)
Vue.component('SwitchInput', SwitchInput)
Vue.component('ValidatedSwitchInput', ValidatedSwitchInput)

Vue.component('AppButton', AppButton)
Vue.component('IconButton', IconButton)

import Vue from 'vue'
import Quill from 'quill'

// @ts-ignore
import VueQuillEditor from 'vue-quill-editor'
// @ts-ignore
import ImageUploader from 'quill-image-uploader'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

Quill.register('modules/imageUploader', ImageUploader)

Vue.use(VueQuillEditor)

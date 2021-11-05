import Vue from 'vue'

import '@/modules/article-editor/article-editor'
import '@/modules/article-editor/plugins/imageposition/imageposition'
import '@/modules/article-editor/plugins/imageresize/imageresize'
import '@/modules/article-editor/plugins/counter/counter'
import '@/modules/article-editor/plugins/filelink/filelink'
import '@/modules/article-editor/plugins/underline/underline'
import '@/modules/article-editor/plugins/reorder/reorder'
import '@/modules/article-editor/plugins/removeformat/removeformat'
// @ts-ignore
import ArticleEditor from '@/modules/vue-article2/ArticleEditor.vue'

// CSS
import '@/modules/article-editor/css/article-editor.min.css'

Vue.component('ArticleEditor', ArticleEditor)

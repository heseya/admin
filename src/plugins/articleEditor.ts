import Vue from 'vue'

import '@/modules/article-editor/article-editor'
// @ts-ignore
import ArticleEditor from '@/modules/vue-article2/ArticleEditor.vue'

// CSS
import '@/modules/article-editor/css/article-editor.min.css'

Vue.component('ArticleEditor', ArticleEditor)

<template>
  <div class="tags-editor">
    <div class="tags-editor__header">
      <span class="tags-editor__title"> {{ $t('title') }} </span>

      <icon-button class="tags-editor__btn" @click="addTag">
        <template #icon> <i class="bx bx-plus"></i> </template>
        {{ $t('addTag') }}
      </icon-button>
    </div>

    <Empty v-if="tags.length === 0" />

    <div v-else class="tags-editor__list">
      <div v-for="(tag, tagIndex) in tags" :key="tagIndex" class="tag">
        <div class="tag__content">
          <select
            :value="tag.type"
            class="tag__type"
            @input="updateTagType(tagIndex, $event.target.value)"
          >
            <option value="link">{{ 'link' }}</option>
            <option value="meta">{{ 'meta' }}</option>
            <option value="script">{{ 'script' }}</option>
          </select>

          <div
            v-for="({ name: property, value: propertyValue }, propIndex) in tag.properties"
            :key="propIndex"
            class="tag__property"
          >
            <input
              type="text"
              class="tag__input tag__input--name"
              :value="property"
              :size="property.length"
              @input="updateProperty(tag, propIndex, 'name', $event.target.value)"
            />
            ="
            <input
              type="text"
              class="tag__input"
              :value="propertyValue"
              :size="propertyValue.length"
              @input="updateProperty(tag, propIndex, 'value', $event.target.value)"
            />
            "

            <button class="tag__prop-del-btn" @click="removeProperty(tag, propIndex)">
              <i class="bx bx-x"></i>
            </button>
          </div>

          <icon-button size="small" class="tag__add-btn" @click="addTagProperty(tag)">
            <template #icon> <i class="bx bx-plus"></i> </template>
          </icon-button>
        </div>

        <icon-button size="small" class="tag__delete-btn" @click="removeTag(tagIndex)">
          <template #icon> <i class="bx bx-trash"></i> </template>
        </icon-button>
      </div>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Addtional tags",
    "addTag": "Add tag"
  },
  "pl": {
    "addTag": "Dodaj tag",
    "title": "Dodatkowe tagi"
  }
}
</i18n>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { SeoMetadataTag } from '@heseya/store-core'
import cloneDeep from 'lodash/cloneDeep'

import Empty from '@/components/layout/Empty.vue'

interface TagProperty {
  name: string
  value: string
}

interface InnerSeoTag {
  type: SeoMetadataTag['type']
  properties: TagProperty[]
}

const EMPTY_TAG: InnerSeoTag = {
  type: 'link',
  properties: [{ name: '', value: '' }],
}

export default defineComponent({
  components: { Empty },
  props: {
    value: {
      type: Array as PropType<SeoMetadataTag[]>,
      default: () => [],
    },
  },
  emits: ['input'],

  computed: {
    tags: {
      get(): InnerSeoTag[] {
        return (this.value || []).map((tag) => ({
          type: tag.type,
          properties: Object.entries(tag)
            .filter(([name]) => name !== 'type')
            .map(([name, value]) => ({
              name,
              value: value?.toString() || '',
            })),
        }))
      },
      set(v: InnerSeoTag[]) {
        this.$emit(
          'input',
          v.map((tag) => ({
            type: tag.type,
            ...Object.fromEntries(tag.properties.map((p) => [p.name, p.value])),
          })),
        )
      },
    },
  },

  methods: {
    addTag() {
      this.tags = [...this.tags, cloneDeep(EMPTY_TAG)]
    },

    removeTag(index: number) {
      this.tags = this.tags.filter((_, i) => i !== index)
    },

    getTagProperties(tag: SeoMetadataTag) {
      return Object.entries(tag).filter(([key]) => key !== 'type')
    },

    removeProperty(tag: InnerSeoTag, propIndex: number) {
      // TODO: ugly code
      this.tags = this.tags.map((t) =>
        t === tag ? { ...t, properties: t.properties.filter((_, i) => i !== propIndex) } : t,
      )
    },

    updateTagType(tagIndex: number, newType: SeoMetadataTag['type']) {
      // TODO: ugly code
      this.tags = this.tags.map((t, i) => (i === tagIndex ? { ...t, type: newType } : t))
    },

    updateProperty(
      tag: InnerSeoTag,
      propIndex: number,
      property: 'name' | 'value',
      newName: string,
    ) {
      // TODO: ugly code
      this.tags = this.tags.map((t) =>
        t === tag
          ? {
              ...t,
              properties: t.properties.map((p, i) =>
                i === propIndex ? { ...p, [property]: newName } : p,
              ),
            }
          : t,
      )
    },

    addTagProperty(tag: InnerSeoTag) {
      // TODO: ugly code
      this.tags = this.tags.map((t) =>
        t === tag ? { ...t, properties: [...t.properties, { name: '', value: '' }] } : t,
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.tags-editor {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-weight: 500;
  }
}

.tag {
  width: 100%;
  display: flex;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: $gray-color-200;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: #333;
  font-weight: 500;
  font-family: monospace;

  &__content {
    display: flex;
    align-items: center;

    &::before {
      content: '<';
    }
    &::after {
      content: '/>';
      margin-left: 8px;
    }
  }

  &__type {
    all: unset;
    cursor: pointer;
    color: $primary-color-500;
    font-weight: 500;
    margin-right: 8px;
  }

  &__property {
    display: flex;
    padding: 0 8px;
    color: $gray-color-500;
  }

  &__input {
    min-width: 20px;
    max-width: 140px;
    border: none;
    background-color: transparent;
    outline: none;
    font-family: monospace;
    font-size: 0.75rem;
    color: $font-color;
    font-weight: 500;
    padding: 0;
    margin: 0;

    &--name {
      color: $gray-color-600;
    }
  }

  &__prop-del-btn {
    all: unset;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      color: $red-color-500;
    }
  }

  &__add-btn {
    margin-left: 8px;
  }

  &__delete-btn {
    margin-left: auto;
  }
}
</style>

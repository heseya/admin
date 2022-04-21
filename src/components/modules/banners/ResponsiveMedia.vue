<template>
  <div class="responsive-media">
    <div class="responsive-media__drag" :title="$t('dragTitle')">
      <i class="bx bx-grid-vertical"></i>
    </div>

    <div class="responsive-media__content" :style="{ backgroundColor: color }">
      <draggable v-model="media" :disabled="disabled" class="responsive-media__list">
        <div v-for="image in media" :key="image.media.id" class="single-media"></div>
      </draggable>

      <button class="add-box-button" @click="addMedia">+</button>
    </div>

    <div class="responsive-media__buttons">
      <icon-button size="small" type="danger" :disabled="disabled" @click="$emit('delete')">
        <template #icon>
          <i class="bx bx-trash"></i>
        </template>
      </icon-button>
    </div>
  </div>
</template>

<i18n>
{
  "pl": {
    "dragTitle": "Przeciągnij zdjęcia"
  },
  "en": {
    "dragTitle": "Drag images"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'

import { ResponsiveMedia } from '@/interfaces/Banner'

export default Vue.extend({
  components: { Draggable },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ResponsiveMedia>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    media: {
      get(): ResponsiveMedia {
        return this.value
      },
      set(v: ResponsiveMedia) {
        this.$emit('input', v)
      },
    },

    // TODO: remove
    color(): string {
      const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
      return colors[Math.floor(Math.random() * colors.length)]
    },
  },

  methods: {
    // TODO: replace with actual media
    addMedia() {
      this.media.push({ min_screen_width: 0, media: { id: Math.random() } as any })
    },
  },
})
</script>

<style lang="scss" scoped>
.responsive-media {
  display: flex;
  justify-content: space-between;

  &__content {
    display: flex;
    align-items: center;
    padding: 8px;
    width: 100%;
    background-color: $gray-color-500;
  }

  &__list {
    display: flex;
  }

  &__drag {
    align-self: stretch;
    cursor: move;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $gray-color-500;
  }

  &__buttons {
    align-self: flex-start;
  }
}

.add-box-button {
  padding: 25px;
  background-color: #fff;
  cursor: pointer;
}

.single-media {
  padding: 25px;
  background-color: teal;
  margin-right: 8px;
}
</style>

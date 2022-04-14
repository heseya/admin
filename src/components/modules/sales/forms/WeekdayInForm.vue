<template>
  <div class="weekday-in-form">
    <small class="weekday-in-form__description">{{ $t('description') }}</small>
    <div class="weekday-in-form__content">
      <div v-for="(day, index) in weekdays" :key="day" class="weekday-in-form__item">
        <input
          :id="`${formId}.${day}`"
          v-model="form.weekday[index]"
          type="checkbox"
          :name="`${formId}.${day}`"
        />
        <label :for="`${formId}.${day}`" class="weekday-in-form__input">
          <i class="icon-true bx bx-check"></i>
          <i class="icon-false bx bx-x"></i>
          {{ $t(`form.${day}`) }}
        </label>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "description": "Select days of week, when discount will be applied",
    "form": {
      "sunday": "Sunday",
      "monday": "Monday",
      "tuesday": "Tuesday",
      "wednesday": "Wednesday",
      "thursday": "Thursday",
      "friday": "Friday",
      "saturday": "Saturday"
    }
  },
  "pl": {
    "description": "Wybierz dni tygodnia, w których warunek będzie spełniony",
    "form": {
      "sunday": "Niedziela",
      "monday": "Poniedziałek",
      "tuesday": "Wtorek",
      "wednesday": "Środa",
      "thursday": "Czwartek",
      "friday": "Piątek",
      "saturday": "Sobota"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { WeekdayInDiscountCondition } from '@/interfaces/SaleCondition'

export default Vue.extend({
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<WeekdayInDiscountCondition>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    weekdays(): string[] {
      return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    formId(): string {
      // ? Unofficial Vue api
      // @ts-ignore
      return this._uid
    },
    form: {
      get(): WeekdayInDiscountCondition {
        return this.value
      },
      set(v: WeekdayInDiscountCondition) {
        this.$emit('input', v)
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.weekday-in-form {
  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 4px;
  }

  &__input {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 4px;
    border: dashed 1px $red-color-400;
    background-color: $red-color-200;
    border-radius: 4px;
    cursor: pointer;

    .bx {
      color: $red-color-500;
      margin-right: 8px;
    }

    .icon-true {
      display: none;
    }
  }

  &__item input:checked + &__input {
    background-color: $green-color-200;
    border-color: $green-color-400;

    .bx {
      color: $green-color-500;
    }

    .icon-true {
      display: initial;
    }
    .icon-false {
      display: none;
    }
  }

  &__item input {
    display: none;
  }
}
</style>

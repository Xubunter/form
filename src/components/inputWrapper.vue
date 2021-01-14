<template>
  <div class="input-wrapper">
    <slot></slot>
    <div class="input-wrapper__error" v-if="value.invalid">
      {{value.error}}
    </div>
  </div>
</template>
<script>
import {FormField} from "./FC";
export default {
  name: "input-wrapper",
  props: {
    value: FormField
  },
};
</script>

<style lang="scss">
.input-wrapper {
  &__field {
    width: 100%;
    border-style: solid;
    border-width: 1px;
    &_error {
      border-color: red;
    }
  }
  &__error {
    color: red;
    text-align: left;
  }
}
</style>

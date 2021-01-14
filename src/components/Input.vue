<template>
  <div class="input">
    <input 
      type="text" 
      class="input__field" 
      :class="{'input__field_error': value.invalid}"
      :value="value.value" 
      v-on="value.listeners"
      
    >
    <div class="input__error" v-if="value.invalid">
      {{value.error}}
    </div>
  </div>
</template>
<script>
import {FormField} from "./FC";
export default {
  name: "input",
  props: {
    value: FormField
  }
};
</script>

<style lang="scss">
.input {
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

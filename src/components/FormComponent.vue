<template>
  <div class="form-component">
    <h2>Полная запись</h2>
    <div>
      <input style="width: 100%" type="text" :value="editing.email.value" v-on="editing.email.listeners">
      <div style="color: red; text-align: left" v-if="editing.email.invalid">{{editing.email.error}}</div>
    </div>
    
    
    <div>
      active: {{editing.email.active}} 
      <br>touched: {{editing.email.touched}}
      <br>visited: {{editing.email.visited}}
      <br>dirty: {{editing.email.dirty}}
      <br>invalid: {{editing.email.invalid}}
    </div>
    <Input v-model="editing.email"/>
    <Input v-model="editing.password"/>
    <InputWrapper v-model="editing.email">
      <input :value="editing.email.value" v-on="editing.email.l">
    </InputWrapper>
    <h2>Короткая запись</h2>
    <Input v-model="form.field1"/>
  </div>
</template>
<script>
import { FormConstructor, require } from './formConstructor.js';
import Input from './Input';
import InputWrapper from './inputWrapper';

export default {
  name: "form-component",
  components: {Input, InputWrapper},
  data() {
    return {
      editing: new FormConstructor('form-name',{
        fields: [
          {
            alias: 'email',
            id: 'email',
            name: 'email',
            initial: 'example@mail.ru',
            rules: [
              require(),
              {
                validator: (v) => v !== 'example@mail.ru',
                message: 'Не должно равняться example@mail.ru'
              },
            ]
          },
          {
            name: 'password',
            rules: [
              require(),
              {
                validator: (v, form) => {
                  console.log(form)
                  if (form) {
                    return form.email.value !== v
                  }
                  return true
                },
                message: 'Не должно равняться email'
              }
            ]
          }
        ],
        options: {
          // validate_on_init: true,
        }
      }), 
      form: new FormConstructor({
        field1: "",
        field2: "1",
      }, {
        // TODO
        rules: {
          field1: [require()]
        },
        options: {
          validate_on_init: true,
        }
      })
    }
  },
  methods: {
    onFocus() {
      console.log('focus');
    }
  }

};
</script>

<style lang="scss">
.form-component {
  display: grid;
  grid-gap: 16px;
  max-width: 500px;
  margin: 0 auto;
}
</style>

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
    <div>
      <h4>Meta формы:</h4>
      <div v-for="item in Object.entries(editing.meta)" :key="item[0]">
        <b>{{item[0]}} : </b>
        {{item[1]}}
      </div>
    </div>
    
    <button @click="onSubmit" :disabled="editing.meta.invalid">Submit</button>
    <h2>Короткая запись</h2>

    <Input v-for="item in form.getFields()" :key="item.name" :value="item" v-on="item.l"/>
    
  </div>
</template>
<script>
import { FC, require } from './FC.js';
import Input from './Input';
import InputWrapper from './inputWrapper';

export default {
  name: "form-component",
  components: {Input, InputWrapper},
  data() {
    return {
      // Длинная запись
      editing: new FC('form-name',{
        fields: [
          {
            alias: 'email', // Достаточно чего-то одного name || id || alias
            id: 'email', // Достаточно чего-то одного name || id || alias
            name: 'email', // Достаточно чего-то одного name || id || alias
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
              require,
              {
                validator: (v, form) => {
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
      // Короткая запись
      form: new FC({
        // Поля формы
        field1: "",
        field2: "1",
      }, {
        // валидаторы
        rules: {
          field1: [
            require,
            {
              validator: (v) => v !== 'example@mail.ru',
              message: 'Не должно равняться example@mail.ru'
            },
          ]
        },
        // 
        options: {
          validate_on_init: true, // Валидировать сразу после создания объекта
        }
      })
    }
  },
  methods: {
    onFocus() {
      console.log('focus');
    },
    onSubmit() {
      console.log(this.editing)
      this.form.addField({
        name: 'test',
        value: '',
      })
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

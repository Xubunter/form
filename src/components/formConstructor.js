export class FormConstructor {
  constructor(arg1, arg2) {
    let name, fields, options;

    if (typeof arg1 === 'object') {
      fields = Object.entries(arg1).map(([key, value]) => ({name: key, alias: key, id: key, value: value, initial: value}));
      console.log(fields)
      name = arg2.name;
      options = arg2.options;
      let rules = arg2.rules;
      if (rules) {
        fields = fields.map(item => {
          let field_rules = rules[item.name];
          if (field_rules) {
            return {...item, rules: field_rules}
          }
        })
      }
    } else {
      name = arg1;
      fields = arg2.fields;
      options = arg2.options;
    }

    let {validate_on_init} = options || {};
    this._name = name;
    if (Array.isArray(fields)) {
      let list_of_fields = fields.map(
        f => new FormField({...f, _parentForm: this})
      );
      list_of_fields.map(
        f => this[f.name] = f
      );
      this._fields = list_of_fields;
    }
    if (validate_on_init === true) {
      this.validate();
    }
    return this;
  }

  getValues() {
    return this._fields.reduce((acc, item) => {
      let key = item.alias || item.id || item.name;
      if (typeof key !== 'string' || typeof key !== 'number') {
        console.error(`Недопустимое значение alias || id || name`, item)
        return acc;
      } 
      return {
        ...acc,
        [key]: item.value,
      }
    }, {})
  }

  onSubmit() {
    this.validate();
  }

  validate() {
    this._fields.forEach(item => item.validate());
    let invalid_fields = this._fields.filter(item => item.initial);
    if (invalid_fields.lenght > 0) {
      return false;
    }
    return true
  }
}

export class FormField {
  value = '';

  visited = false; // Если поле было в фокусе или в фокусе сейчас
	touched = false; // Если поле было в фокусе и было заблюрено (onBlur)
  active = false; // Сейчас в фокусе
  
	dirty = false; // Если значение отличается от изначального
	invalid = false; // Значение не валидно
	
	initial = ''; // Начальное значение
	error = null; // Текст ошибки
  warning = null; // Текст предупреждения
  
  rules = [];
  warning_validators = [];

  constructor (props) {
    let {
      name,
      alias,
      id,
      initial,
      rules,
      value,
      _parentForm,
      validate_on_init,
    } = props;
    this.name = name;
    this.alias = alias;
    this.id = id;
    if (props.hasOwnProperty('initial')) {
      this.initial = initial;
      if (props.hasOwnProperty('value')) {
        this.value = value;
      } else {
        this.value = initial;
      }
    } else {
      this.initial = this.value;
    }
    if (Array.isArray(rules)) {
      this.rules = rules;
    }
    if (_parentForm) {
      this.form = _parentForm;
    }
    if (validate_on_init === true) {
      this.validate();
    }
    
  }

  validate = () => {
    let error = this.rules.map(rule => {
      if (typeof rule.validator === 'function') {
        return !rule.validator(this.value, this.form) ? rule.message : undefined;
      }
      return undefined;
    }).find(Boolean)
    
    this.error = error;
    this.invalid = error != null
    return {
      error: this.error,
    }
  }

  get listeners() {
    return {
      focus: this.onFocus,
      blur: this.onBlur,
      change: this.onChange,
      input: this.onInput,
    }
  }

  get l() {
    return this.listeners
  }

  onFocus = () => {
    this.visited = true;
    this.active = true;
  }
  onBlur = () => {
    this.touched = true;
    this.active = false;
    this.validate();
  }
  onChange = (e) => {
    if (e && e.target && e.target.value != null) {
      this.value = e.target.value;
    } else {
      this.value = e
    }
    this.setDirty();
  }
  onInput = (e) => {
    this.onChange(e);
  }

  setDirty = (val) => {
    let value = val ? val : this.value;
    // TODO Сравнение объектов
    if (value !== this.initial) {
      this.dirty = true;
    } else {
      this.dirty = false;
    }
  }
}

// validators 

export const require = (message) => {
  return {
    validator: val => !!val,
    message: message || 'Обязательно для заполнения' 
  }
}
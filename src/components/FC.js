export class FC {
  constructor(arg1, arg2) {
    let name, fields, options;

    if (typeof arg1 === 'object') {
      fields = Object.entries(arg1).map(([key, value]) => ({name: key, alias: key, id: key, value: value, initial: value}));
      name = arg2.name;
      options = arg2.options;
      let rules = arg2.rules;
      if (rules) {
        fields = fields.map(item => {
          let field_rules = rules[item.name];
          if (field_rules) {
            return {...item, rules: field_rules}
          }
          return item;
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
        f => this[f.name || f.alias || f.id] = f
      );
      this._fields = list_of_fields;
    }
    if (validate_on_init === true) {
      this.validate();
    }
    return this;
  }

  getFields() {
    return this._fields;
  }

  addField(field) {
    let name = field.name || field.alias || field.id;
    let name_collision = !!this._fields.find(f => f.name === name);
    if (name_collision) {
      console.error(`Поле ${name} уже существует`)
      return;
    }
    let new_field = new FormField(field);
    this[name] = new_field;
    this._fields.push(new_field)
  }

  get _invalid() {
    
    return this._fields.some(field => field.invalid);
  }

  get _dirty() {
    return this._fields.some(field => field.dirty);
  }

  get _some_touched() {
    return this._fields.some(field => field.touched);
  }

  get _all_touched() {
    return this._fields.every(field => field.touched);
  }

  get _active() {
    return this._fields.some(field => field.active);
  }

  get _some_visited() {
    return this._fields.some(field => field.visited);
  }

  get _all_visited() {
    return this._fields.every(field => field.visited);
  }

  get meta() {
    return {
      invalid: this._invalid,
      dirty: this._dirty,
      some_touched: this._some_touched,
      all_touched: this._all_touched,
      some_visited: this._some_visited,
      all_visited: this._all_visited,
      active: this._active,
    }
  } 

  getValues() {
    return this._fields.reduce((acc, item) => {
      let key = item.alias || item.id || item.name;
      console.log(typeof key)
      if (typeof key !== 'string' && typeof key !== 'number') {
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
    let invalid_fields = this._fields.filter(item => item.invalid);
    if (invalid_fields.length > 0) {
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
      let _rule;
      if (typeof rule === 'function') {
        _rule = rule();
      } else {
        _rule = rule;
      }

       // Обязательно должна быть функция validator в объекте
      if (!_rule && typeof _rule.validator !== 'function') {
        console.error('validator должен быть функцией', _rule)
        return undefined;
      }
      return !_rule.validator(this.value, this.form) ? _rule.message || true : undefined;

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
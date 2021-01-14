import { FormField, FormConstructor } from "../formConstructor";

test("simple field", () => {
  let field = new FormField({
    name: "email",
  });

  expect(field.value).toBe("");
  expect(field.name).toBe("email");
  expect(
    [field.touched, field.active, field.visited].every((v) => v === false)
  ).toBe(true);
  field.onFocus();
  expect(field.visited).toBe(true);
  expect(field.active).toBe(true);
  expect(field.touched).toBe(false);
  field.onBlur();
  expect(field.visited).toBe(true);
  expect(field.touched).toBe(true);
  expect(field.active).toBe(false);
});

test("field with initial value", () => {
  let field = new FormField({
    name: "email",
    initial: "example@gmail.com",
  });

  expect(field.value).toBe("example@gmail.com");
  field.onChange("test@gmail.com");
  expect(field.value).toBe("test@gmail.com");
  expect(field.dirty).toBe(true);
  field.onChange("example@gmail.com");
  expect(field.dirty).toBe(false);
});

test("validators", () => {
  let field = new FormField({
    name: "email",
    initial: "example@gmail.com",
    rules: [
      {
        validator: (val) => val !== '',
        message: "Обязательно для заполнения",
      },
    ],
  });

  expect(field.value).toBe("example@gmail.com");
  field.onChange("");
  expect(field.value).toBe("");
  expect(field.invalid).toBe(true);
});

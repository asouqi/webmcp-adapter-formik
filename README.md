# webmcp-adapter-formik

Formik integration for [webmcp-forms](https://github.com/asouqi/webmcp-forms) — connects AI-powered form tools to your Formik context with a single hook.

---

## Installation

```bash
npm install webmcp-adapter-formik formik webmcp-adapter webmcp-forms
# or
pnpm add webmcp-adapter-formik formik webmcp-adapter webmcp-forms
```

---

## Quick Start

```tsx
import { Formik, Form, Field } from 'formik'
import { useFormikTools } from 'webmcp-adapter-formik'
import type { FormField } from 'webmcp-adapter-formik'

const fields: Record<string, FormField> = {
    name:  { type: 'string', required: true, minLength: 2 },
    email: { type: 'string', required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
    age:   { type: 'number', min: 18 },
}

function FormWithTools() {
    // One line — that's it!
    useFormikTools({ formId: 'contact', fields })

    return (
        <Form>
            <Field name="name"  placeholder="Name" />
            <Field name="email" type="email"  placeholder="Email" />
            <Field name="age"   type="number" placeholder="Age" />
            <button type="submit">Submit</button>
        </Form>
    )
}

export default function App() {
    return (
        <Formik
            initialValues={{ name: '', email: '', age: null }}
            onSubmit={(values) => console.log('Submitted:', values)}
        >
            <FormWithTools />
        </Formik>
    )
}
```

> **Note:** `useFormikTools` must be called inside a `<Formik>` component or a `withFormik()` HOC.

---

## API

### `useFormikTools<TValues>(options)`

A React hook that registers AI-callable tools bound to the surrounding Formik context. All tools are automatically unregistered when the component unmounts.

#### Options

| Option             | Type                          | Required | Description                                                          |
|--------------------|-------------------------------|----------|----------------------------------------------------------------------|
| `formId`           | `string`                      | ✅        | Unique identifier for the form. Used as a prefix for all tool names. |
| `fields`           | `Record<string, FormField>`   | ✅        | Field definitions (type, validation constraints, etc.)               |
| `selectedTools`    | `Set<FormTools>`              | —        | Subset of tools to register. Defaults to all tools.                  |
| `customTools`      | `ToolDefinition[]`            | —        | Additional custom tools to include alongside the built-in ones.      |
| `validationSchema` | `ValidationSchema`            | —        | Optional schema (Yup, Zod, etc.) for form/field-level validation.    |

#### `validationSchema` shape

```ts
{
    form?:              any  // Used by validate-form
    fillField?:         any  // Used by fill-field — validates { field, value }
    fillMultipleField?: any  // Used by fill-multiple-fields — validates { fields: { ... } }
}
```

If omitted, the built-in JSON Schema validator from `webmcp-forms` is used.

---

## Available Tools

Once registered, the following AI tools are available under the `{formId}` namespace:

| Tool name                         | Description                                     |
|-----------------------------------|-------------------------------------------------|
| `fill_{formId}_field`             | Fill a single form field                        |
| `fill_{formId}_multiple_fields`   | Fill multiple fields at once                    |
| `get_{formId}_state`              | Get all current values, errors, and touched state |
| `get_{formId}_field_value`        | Get a specific field's current value            |
| `validate_{formId}_form`          | Validate all fields without submitting          |
| `submit_{formId}_form`            | Submit the form                                 |
| `reset_{formId}_form`             | Reset the form to its initial values            |
| `clear_{formId}_field`            | Clear a specific field to its default empty value |

---

## Recipes

### Select specific tools only

```tsx
import { useFormikTools } from 'webmcp-adapter-formik'
import type { FormTools } from 'webmcp-adapter-formik'

useFormikTools({
    formId: 'checkout',
    fields,
    selectedTools: new Set<FormTools>([
        'fill-field',
        'fill-multiple-field',
        'submit-form',
    ]),
})
```

### With Yup validation

```tsx
import * as Yup from 'yup'

const schema = Yup.object({
    name:  Yup.string().min(2).required(),
    email: Yup.string().email().required(),
    age:   Yup.number().min(18),
})

const fillFieldSchema = Yup.object({
    field: Yup.string().oneOf(['name', 'email', 'age']).required(),
    value: Yup.mixed(),
})

const fillMultipleFieldSchema = Yup.object({
    fields: Yup.object().shape({
        name:  Yup.string().optional(),
        email: Yup.string().optional(),
        age:   Yup.number().optional(),
    }),
})

useFormikTools({
    formId: 'checkout',
    fields,
    validationSchema: {
        form:              schema,
        fillField:         fillFieldSchema,
        fillMultipleField: fillMultipleFieldSchema,
    },
})
```

### TypeScript — typed form values

```tsx
interface MyFormValues {
    name:  string
    email: string
    age:   number | null
}

function FormWithTools() {
    useFormikTools<MyFormValues>({ formId: 'contact', fields })
    // ...
}
```

---

## Peer Dependencies

| Package  | Version  |
|----------|----------|
| `react`  | `>= 18`  |
| `formik` | `>= 2`   |

---

## Related Packages

| Package | Description |
|---------|-------------|
| [webmcp-forms](https://github.com/asouqi/webmcp-forms) | Core AI form-tools library |
| [webmcp-adapter](https://github.com/nicholasgriffintn/webmcp-adapter) | WebMCP adapter core |

---

## License

[MIT](./LICENSE)
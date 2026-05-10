# webmcp-adapter-formik

Formik integration for [webmcp-forms](https://github.com/asouqi/webmcp-forms). Connects AI-powered form tools to Formik context with a single hook.

## Installation

```bash
npm install webmcp-adapter-formik formik webmcp-adapter webmcp-forms
```

## API

### `useFormikTools(options)`

A React hook that connects webmcp-forms tools to Formik context. Must be used inside a `<Formik>` component or `withFormik()` HOC.

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `formId` | `string` | Yes | Unique identifier for the form |
| `fields` | `Record<string, FormField>` | Yes | Field definitions with validation rules |
| `selectedTools` | `Set<FormTools>` | No | Specific tools to include (defaults to all) |

#### Example with Selected Tools

```tsx
import { useFormikTools } from 'webmcp-adapter-formik'
import type { FormTools } from 'webmcp-adapter-formik'

// Only include specific tools
useFormikTools({
    formId: 'checkout',
    fields,
    selectedTools: new Set<FormTools>([
        'fill-field',
        'fill-multiple-field',
        'submit-form'
    ])
})
```


## Quick Start

```tsx
import { Formik, Form, Field } from 'formik'
import { useFormikTools } from 'webmcp-adapter-formik'
import type { FormField } from 'webmcp-adapter-formik'

// Define your form fields
const fields: Record<string, FormField> = {
    name: { type: 'string', required: true, minLength: 2 },
    email: { type: 'string', required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
    age: { type: 'number', min: 18 }
}

function FormWithTools() {
    // Connect to Formik context - that's it!
    useFormikTools({
        formId: 'contact',
        fields
    })

    return (
        <Form>
            <Field name="name" placeholder="Name" />
            <Field name="email" type="email" placeholder="Email" />
            <Field name="age" type="number" placeholder="Age" />
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


## Available Tools

When you use `useFormikTools`, the following AI tools are automatically registered:

| Tool | Description |
|------|-------------|
| `fill_{formId}_field` | Fill a single form field |
| `fill_{formId}_multiple_fields` | Fill multiple fields at once |
| `get_{formId}_state` | Get all current form values, errors, and touched state |
| `get_{formId}_field_value` | Get a specific field's current value |
| `validate_{formId}_form` | Validate all fields without submitting |
| `submit_{formId}_form` | Submit the form |
| `reset_{formId}_form` | Reset form to initial values |
| `clear_{formId}_field` | Clear a field to its default empty value |


## TypeScript

The hook is fully typed and supports generic form values:

```tsx
interface MyFormValues {
    name: string
    email: string
    age: number | null
}

function FormWithTools() {
    useFormikTools<MyFormValues>({
        formId: 'contact',
        fields
    })
    // ...
}
```

## Peer Dependencies

- `react` >= 18.0.0
- `formik` >= 2.0.0

## Related Packages

- [webmcp-forms](https://github.com/asouqi/webmcp-forms) - Core form tools library
- [webmcp-adapter](https://github.com/nicholasgriffintn/webmcp-adapter) - WebMCP adapter core

## License

MIT
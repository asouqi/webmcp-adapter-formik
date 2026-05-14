# webmcp-adapter-formik

Formik integration for [WebMCP](https://github.com/anthropics/anthropic-tools). Connect AI-powered form tools to your Formik forms.

## Installation

```bash
npm install webmcp-adapter-formik formik webmcp-adapter webmcp-forms
```

## Quick Start

```tsx
import { Formik, Form, Field } from 'formik'
import { useFormikTools } from 'webmcp-adapter-formik'

const fields = {
    name: { type: 'string', required: true, minLength: 2 },
    email: { type: 'string', required: true },
    age: { type: 'number', min: 18 }
}

function MyForm() {
    return (
        <Formik
            initialValues={{ name: '', email: '', age: null }}
            onSubmit={(values) => console.log(values)}
        >
            <FormContent />
        </Formik>
    )
}

function FormContent() {
    useFormikTools({
        formId: 'contact',
        fields
    })

    return (
        <Form>
            <Field name="name" placeholder="Name" />
            <Field name="email" placeholder="Email" />
            <Field name="age" type="number" placeholder="Age" />
            <button type="submit">Submit</button>
        </Form>
    )
}
```

## Hooks

### `useFormikTools`

Main hook for form field operations. Registers tools for filling, getting, validating, submitting, and resetting form fields.

```tsx
useFormikTools({
    formId: 'contact',
    fields: {
        name: { type: 'string', required: true },
        email: { type: 'string', required: true }
    },
    selectedTools: new Set(['fill-field', 'get-form-state']), // Optional: limit tools
    customTools: [...] // Optional: add custom tools
})
```

**Tools registered:**
- `fill_contact_field` - Set a single field value
- `fill_contact_multiple_fields` - Set multiple field values
- `get_contact_form_state` - Get all form values
- `get_contact_field_value` - Get a specific field value
- `validate_contact_form` - Validate the form
- `submit_contact_form` - Submit the form
- `reset_contact_form` - Reset the form
- `clear_contact_field` - Clear a field value

---

### `useFormikFieldArrayTools`

For managing dynamic arrays (e.g., list of addresses, phone numbers, cart items).

```tsx
useFormikFieldArrayTools({
    formId: 'checkout',
    fieldName: 'items',
    itemFields: {
        name: { type: 'string', required: true },
        quantity: { type: 'number', min: 1 }
    },
    minItems: 1,
    maxItems: 10
})
```

**Tools registered:**
- `get_checkout_items` - Get all items
- `add_checkout_items` - Add a new item
- `insert_checkout_items` - Insert item at index
- `update_checkout_items` - Update item at index
- `remove_checkout_items` - Remove item at index
- `move_checkout_items` - Move item to new index
- `swap_checkout_items` - Swap two items
- `clear_checkout_items` - Remove all items

---

### `useFormikErrorTools`

Exposes validation errors to AI.

```tsx
useFormikErrorTools({
    formId: 'contact'
})
```

**Tools registered:**
- `get_contact_errors` - Get all validation errors
- `get_contact_field_error` - Get error for a specific field

---

### `useFormikStatusTools`

Exposes form status (dirty, submitting, valid, etc.) to AI.

```tsx
useFormikStatusTools({
    formId: 'contact'
})
```

**Tools registered:**
- `get_contact_status` - Get form status (dirty, isSubmitting, isValid, submitCount)

---

### `useFormikStepsTools`

For multi-step/wizard forms.

```tsx
const [activeStep, setActiveStep] = useState(0)

useFormikStepsTools({
    formId: 'checkout',
    steps: ['Shipping', 'Payment', 'Review'],
    currentStep: activeStep,
    onStepChange: setActiveStep
})
```

**Tools registered:**
- `get_checkout_step` - Get current step info
- `next_checkout_step` - Go to next step
- `prev_checkout_step` - Go to previous step
- `go_to_checkout_step` - Go to specific step

---

## Components

### `FormikTools`

Declarative component alternative to `useFormikTools`.

```tsx
<Formik initialValues={...} onSubmit={...}>
    <Form>
        <FormikTools formId="contact" fields={fields} />
        <Field name="name" />
        <Field name="email" />
    </Form>
</Formik>
```

---

## Full Example

```tsx
import { useState } from 'react'
import { Formik, Form, Field, FieldArray } from 'formik'
import {
    useFormikTools,
    useFormikFieldArrayTools,
    useFormikErrorTools,
    useFormikStatusTools,
    useFormikStepsTools
} from 'webmcp-adapter-formik'

const fields = {
    name: { type: 'string', required: true },
    email: { type: 'string', required: true }
}

const itemFields = {
    product: { type: 'string', required: true },
    quantity: { type: 'number', min: 1 }
}

function CheckoutForm() {
    const [step, setStep] = useState(0)

    return (
        <Formik
            initialValues={{ name: '', email: '', items: [] }}
            onSubmit={(values) => console.log('Submitted:', values)}
        >
            <FormContent step={step} setStep={setStep} />
        </Formik>
    )
}

function FormContent({ step, setStep }) {
    // Form tools
    useFormikTools({ formId: 'checkout', fields })

    // Array tools
    useFormikFieldArrayTools({
        formId: 'checkout',
        fieldName: 'items',
        itemFields
    })

    // Error tools
    useFormikErrorTools({ formId: 'checkout' })

    // Status tools
    useFormikStatusTools({ formId: 'checkout' })

    // Step tools
    useFormikStepsTools({
        formId: 'checkout',
        steps: ['Info', 'Items', 'Review'],
        currentStep: step,
        onStepChange: setStep
    })

    return (
        <Form>
            {step === 0 && (
                <>
                    <Field name="name" placeholder="Name" />
                    <Field name="email" placeholder="Email" />
                </>
            )}

            {step === 1 && (
                <FieldArray name="items">
                    {({ push, remove }) => (
                        <>
                            {/* Render items */}
                            <button type="button" onClick={() => push({ product: '', quantity: 1 })}>
                                Add Item
                            </button>
                        </>
                    )}
                </FieldArray>
            )}

            {step === 2 && <div>Review your order...</div>}

            <button type="button" onClick={() => setStep(step - 1)} disabled={step === 0}>
                Back
            </button>
            <button type="button" onClick={() => setStep(step + 1)} disabled={step === 2}>
                Next
            </button>
            {step === 2 && <button type="submit">Submit</button>}
        </Form>
    )
}
```

---

## API Reference

### Field Types

```typescript
type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object'

interface FormField {
    type: FieldType
    label?: string
    required?: boolean
    options?: string[]      // For enum/select fields
    min?: number            // For number fields
    max?: number            // For number fields
    minLength?: number      // For string fields
    maxLength?: number      // For string fields
    minItems?: number       // For array fields
    maxItems?: number       // For array fields
    pattern?: string        // Regex for string fields
}
```

---

## License

MIT
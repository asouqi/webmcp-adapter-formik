import {Formik, Form, Field, FieldArray, useFormikContext} from 'formik'
import {useFormikTools, useFormikFieldArrayTools} from '../../src'
import type { FormField } from "webmcp-forms"
import * as Yup from 'yup'

const fields: Record<string, FormField> = {
    name: { type: 'string' },
    email: { type: 'string' },
    age: { type: 'number' }
}

const itemFields: Record<string, FormField> = {
    name: { type: 'string', required: true },
    quantity: { type: 'number', required: true },
    price: { type: 'number', required: true },
}

const fieldsDefinitions = {
    name: Yup.string().min(2, 'Too Short!').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    age: Yup.number().min(18),
}

const fieldsObject = Yup.object(fieldsDefinitions)

export const fillFieldSchema = Yup.object({
    field: Yup.string().oneOf(Object.keys(fieldsDefinitions)).required(),
    value: Yup.lazy((_value, { parent }) => {
        return fieldsDefinitions[parent.field] || Yup.mixed();
    }),
});

const partialFormSchema = Yup.object().shape(
    Object.fromEntries(
        Object.entries(fieldsDefinitions).map(([key, schema]) => [key, schema.optional()])
    )
);

export const fillMultipleFieldSchema = Yup.object({
    fields: partialFormSchema
});

const itemSchema = Yup.object({
    item: Yup.object({
        name: Yup.string().required('Required'),
        quantity: Yup.number().min(1).required('Required'),
        price: Yup.number().min(0).required('Required'),
    })
})

export default function App() {
    return (
        <Formik
            validationSchema={fieldsObject}
            initialValues={{
                name: '',
                email: '',
                age: 0,
                items: [{ name: '', quantity: 1, price: 0 }]
            }}
            onSubmit={(values) => console.log('Submitted:', values)}
        >
            <FormWithTools/>
        </Formik>
    )
}

function FormWithTools() {
    // That's it! Connects to Formik context automatically
    useFormikTools({
        formId: 'checkout',
        fields,
        validationSchema: {
            form: fieldsObject,
            fillField: fillFieldSchema,
            fillMultipleField: fillMultipleFieldSchema
        },
        selectedTools: new Set(['fill-field', "clear-field"])
    })

    useFormikFieldArrayTools({
        formId: 'checkout',
        fieldName: 'items',
        itemFields,
        minItems: 1,
        maxItems: 10,
        validationSchema: itemSchema,
    })

    const { values } = useFormikContext()

    return (
        <Form>
            <Field name="name" placeholder="Name"/>
            <Field name="email" type="email" placeholder="Email"/>
            <Field name="age" type="number" placeholder="Age"/>

            <FieldArray name="items">
                {({ remove, push }) => (
                    <div>
                        {/* @ts-ignore */}
                        {values.items.map((item, index) => (
                            <div key={index}>
                                <Field name={`items[${index}].name`} placeholder="Item name"/>
                                <Field name={`items[${index}].quantity`} type="number" placeholder="Quantity"/>
                                <Field name={`items[${index}].price`} type="number" placeholder="Price"/>
                                <button type="button" onClick={() => remove(index)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => push({ name: '', quantity: 1, price: 0 })}>
                            Add Item
                        </button>
                    </div>
                )}
            </FieldArray>

            <button type="submit">Submit</button>
        </Form>
    )
}
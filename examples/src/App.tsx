import {Formik, Form, Field} from 'formik'
import {useFormikTools} from '../../src'
import type { FormField } from "webmcp-forms"
import * as Yup from 'yup'

const fields: Record<string, FormField> = {
    name: { type: 'string' },
    email: { type: 'string' },
    age: { type: 'number' }
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
        // Return the specific schema based on the 'field' property
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

export default function App() {
    return (
        <Formik
            validationSchema={fieldsObject}
            initialValues={{name: '', email: '', age: 0}}
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
            fillField:  fillFieldSchema,
            fillMultipleField: fillMultipleFieldSchema
        }
    })

    return (
        <Form>
            <Field name="name" placeholder="Name"/>
            <Field name="email" type="email" placeholder="Email"/>
            <Field name="age" type="number" placeholder="Age"/>
            <button type="submit">Submit</button>
        </Form>
    )
}

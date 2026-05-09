import {Formik, Form, Field} from 'formik'
import {useFormikTools} from '../../src'
// import { FormField } from "webmcp-forms"
import { ToolDefinition } from "webmcp-adapter"

const fields: Record<string, any> = {
    name: {type: 'string', required: true, minLength: 2},
    email: {type: 'string', required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$'},
    age: {type: 'number', min: 18}
}

export default function App() {
    return (
        <Formik
            initialValues={{name: '', email: '', age: null}}
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
        fields
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

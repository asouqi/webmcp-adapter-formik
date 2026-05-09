import { useEffect, useRef } from "react"
import { registerBatch } from "webmcp-adapter"
import { createFormTools, FormField, FormTools} from "webmcp-forms"
import { FormikValues, useFormikContext} from "formik"

export interface UseFormikToolsOptions {
    /** Unique identifier for the from */
    formId: string
    /** Fields definitions */
    fields: Record<string, FormField>
    /** Specific tools to includes (defaults to all) */
    selectedTools?: Set<FormTools>
}

/**
 * Connects webmcp-forms tools to Formik context.
 * Must be used inside a <Formik> or withFormik() component.
 */
export function useFormikTools<TValue extends FormikValues = FormikValues>(options: UseFormikToolsOptions) {
    const { formId, fields, selectedTools } = options
    const { values, setFieldValue, submitForm, resetForm } = useFormikContext<TValue>()

    const valuesRef = useRef(values)
    valuesRef.current = values

    const setFieldValueRef = useRef(setFieldValue)
    setFieldValueRef.current = setFieldValue

    const submitFormRef = useRef(submitForm)
    submitFormRef.current = submitForm

    const resetFormRef = useRef(resetForm)
    resetFormRef.current = resetForm

    useEffect(() => {
        if (valuesRef.current) {
            const tools = createFormTools({
                formId,
                fields,
                getValues: () => valuesRef.current,
                onChange: (field, value) => {
                    setFieldValueRef.current && setFieldValueRef.current(field, value)
                },
                onSubmit: () => {
                    submitFormRef.current && submitFormRef.current()
                },
                onReset: () => {
                    resetFormRef.current && resetFormRef.current()
                },
                selectedTools
            })
            const unregister = registerBatch(tools)
            return () => unregister()
        }
    }, [formId, fields, selectedTools])
}

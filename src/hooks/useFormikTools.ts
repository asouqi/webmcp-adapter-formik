import { useEffect, useRef } from "react"
import {registerBatch, ToolDefinition} from "webmcp-adapter"
import { createFormTools, FormField, FormTools} from "webmcp-forms"
import { FormikValues, useFormikContext} from "formik"

export interface UseFormikToolsOptions {
    /** Unique identifier for the form */
    formId: string
    /** Fields definitions */
    fields: Record<string, FormField>
    /** Specific tools to includes (defaults to all) */
    selectedTools?: Set<FormTools>
    /** Additional custom tools to include */
    customTools?: ToolDefinition[]
    /**
     * Optional custom validator (Zod, Valibot, ArkType).
     * If not provided, the built-in JSON Schema validator is used.
     */
    validationSchema?: {
        /** use by validateForm */
        form?: any;
        /** use by validateField - validate { field: 'name', value: '...'} */
        fillField?: any;
        /** used by fillMultipleField — validates { fields: { name, email, ... } } */
        fillMultipleField?: any;
    }
}

/**
 * Connects webmcp-forms tools to Formik context.
 * Must be used inside a <Formik> or withFormik() component.
 */
export function useFormikTools<TValue extends FormikValues = FormikValues>(options: UseFormikToolsOptions) {
    const { formId, fields, selectedTools, customTools, validationSchema } = options
    const { values, setFieldValue, submitForm, resetForm } = useFormikContext<TValue>()

    const valuesRef = useRef(values)
    valuesRef.current = values

    const setFieldValueRef = useRef(setFieldValue)
    setFieldValueRef.current = setFieldValue

    const submitFormRef = useRef(submitForm)
    submitFormRef.current = submitForm

    const resetFormRef = useRef(resetForm)
    resetFormRef.current = resetForm

    const selectedToolsRef = useRef(selectedTools)
    selectedToolsRef.current = selectedTools

    const customToolsRef = useRef(customTools)
    customToolsRef.current = customTools

    useEffect(() => {
        if (valuesRef.current) {
            const tools = createFormTools({
                formId,
                fields,
                validationSchema,
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
                selectedTools: selectedToolsRef.current,
                customTools: customToolsRef.current
            })
            const unregister = registerBatch(tools)
            return () => unregister()
        }
    }, [formId, fields])
}

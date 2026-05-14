import {useEffect, useRef} from "react"
import {useFormikContext} from "formik"
import {JsonValue, registerBatch} from "webmcp-adapter"
import {UseFormikFieldArrayToolsOptions} from "../types"
import {createFieldArrayTools} from "../fieldArray/createFieldArrayTools"

export function useFormikFieldArrayTools(options: UseFormikFieldArrayToolsOptions) {
    const { formId, fieldName, itemFields, maxItems, minItems, validationSchema, selectedTools, customTools  } = options
    const { values, setFieldValue } = useFormikContext<Record<string, JsonValue[]>>()

    const valuesRef = useRef(values)
    valuesRef.current = values

    const setFieldValueRef = useRef(setFieldValue)
    setFieldValueRef.current = setFieldValue

    useEffect(() => {
        const tools = createFieldArrayTools({
            formId,
            fieldName,
            itemFields,
            maxItems,
            minItems,
            validationSchema,
            getItems: () => valuesRef.current[fieldName] ?? [],
            onChange: (items) => setFieldValueRef.current(fieldName, items),
            customTools,
            selectedTools,
        })
        const unregister = registerBatch(tools)
        return () => unregister()
    }, [formId, fieldName, itemFields, maxItems, minItems, selectedTools])
}
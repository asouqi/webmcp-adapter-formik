import { FormikErrors, FormikTouched, useFormikContext } from "formik"
import {defineTool, registerBatch} from "webmcp-adapter"
import {RefObject, useEffect, useRef} from "react";

const createGetErrorsTool = <T>(formId: string, errorsRef: RefObject<FormikErrors<T>>) => {
  return defineTool({
      name: `get_${formId}_errors`,
      description: `Get all current validation errors for the ${formId} form`,
      inputSchema: {
          type: "object",
          properties: {},
          required: []
      },
      execute: () => {
          const errors = errorsRef.current || {}
          const errorsEntries = Object.entries(errors)
          const hasErrors = errorsEntries.length > 0
          return {
              content: [{
                  type: "text",
                  text: hasErrors ? `Validation errors:\n${errorsEntries.map(([f, e]) => `• ${f}: ${e}`).join('\n')}` :
                      `No validation errors`
              }],
              structuredContent: {
                  hasErrors,
                  errors: errors
              }
          }
      }
  })
}

const createGetFieldError = <T>(formId: string, errorsRef: RefObject<FormikErrors<T>>, touchedRef: RefObject<FormikTouched<T>>) => {
    return defineTool({
        name: `get_${formId}_field_error`,
        description: `Get validation error for a specific field in the ${formId} form`,
        inputSchema: {
            type: "object",
            properties: {
                field: { type: "string", description: "Field name to check" }
            },
            required: ["field"]
        },
        execute: ({ field }) => {
            const error = errorsRef.current?.[field]
            const isTouched = touchedRef.current?.[field]
            return {
                content: [{
                    type: "text",
                    text: error ? `${field}: ${error}${isTouched ? '' : ' (field not touched yet)'}` :
                        `No error for ${field}`
                }],
                structuredContent: {
                    field,
                    error: error || null,
                    touched: isTouched || false
                }
            }
        }
    })
}

interface UseFormikErrorToolsOptions {
    /** Form identifier */
    formId: string
}

/**
 * Registers tools for AI to check validation errors.
 * Tool: get_errors, get_field_error */
export function useFormikErrorTools(options: UseFormikErrorToolsOptions) {
    const { formId } = options
    const { errors, touched } = useFormikContext()

    const errorsRef = useRef(errors)
    errorsRef.current = errors

    const touchedRef = useRef(touched)
    touchedRef.current = touched

    useEffect(() => {
        const tools = [
            createGetErrorsTool(formId, errorsRef),
            createGetFieldError(formId, errorsRef, touchedRef)
        ]

        const unregister = registerBatch(tools)
        return () => unregister()
    }, [formId])
}
import { RefObject, useEffect, useRef } from "react"
import { useFormikContext } from "formik"
import {defineTool, JsonValue, registerTool} from "webmcp-adapter"

interface FormikStatus {
    dirty: boolean
    isSubmitting: boolean
    isValid: boolean
    isValidating: boolean
    submitCount: number
}

const createGetFormikStatusTool = (formId: string, statusRef: RefObject<FormikStatus>) => {
    return defineTool({
        name: `get_${formId}_status`,
        description: `Get the current status of the ${formId} form (dirty, submitting, valid, etc.)`,
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        },
        execute: () => {
            const status = statusRef.current
            const statusLines = [
                status.dirty ? "• Form has unsaved changes" : "• Form is unchanged",
                status.isSubmitting ? "• Currently submitting..." : null,
                status.isValidating ? "• Currently validating..." : null,
                status.isValid ? "• Form is valid" : "• Form has validation errors",
                `• Submit attempts: ${status.submitCount}`
            ].filter(Boolean)

            return {
                content: [{
                    type: "text",
                    text: `Form ${formId} status:\n${statusLines.join('\n')}`
                }],
                structuredContent: { status: status as JsonValue }
            }
        }
    })
}

export interface UseFormikStatusToolsOptions {
    /** Form identifier */
    formId: string
}

/**
 * Registers tool for AI to check form status.
 * Tool: get_status */
export function useFormikStatusTools(options: UseFormikStatusToolsOptions) {
    const { formId } = options
    const { dirty, isSubmitting, isValid, isValidating, submitCount } = useFormikContext()

    const statusRef = useRef<FormikStatus>({
        dirty,
        isSubmitting,
        isValid,
        isValidating,
        submitCount
    })
    statusRef.current = {
        dirty,
        isSubmitting,
        isValid,
        isValidating,
        submitCount,
    }

    useEffect(() => {
        const tool = createGetFormikStatusTool(formId, statusRef)
        const unregister = registerTool(tool)
        return () => unregister()
    }, [formId])
}
import { useEffect } from "react"
import { registerBatch } from "webmcp-adapter"
import {
    createGetStepTool,
    createNextStepTool,
    createPrevStepTool,
    createGoToStepTool,
    FormStepsConfig,
    FormStepsState
} from "../formSteps"

export interface UseFormikStepsToolsOptions {
    /** Form identifier */
    formId: string
    /** Steps names/labels */
    steps: string[]
    /** Get current active step (0-based) */
    getCurrentStep: () => number
    /** Callback when step change */
    onStepChange: (step: number) => void
}

/**
 * Registers tools for AI to navigate multi-step forms.
 * Tools: get_step, next_step, prev_step, go_to_step */
export function useFormikStepsTools(options: UseFormikStepsToolsOptions) {
    const { formId, steps, getCurrentStep, onStepChange } = options

    useEffect(() => {
        const config: FormStepsConfig = { formId, steps }
        const state: FormStepsState = { getCurrentStep, onStepChange }
        const tools = [
            createGetStepTool(config, state),
            createNextStepTool(config, state),
            createPrevStepTool(config, state),
            createGoToStepTool(config, state)
        ]

        const unregister = registerBatch(tools)
        return () => unregister()
    }, [formId, steps])
}
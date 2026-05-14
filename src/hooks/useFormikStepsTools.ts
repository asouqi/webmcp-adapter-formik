import {useEffect, useRef} from "react"
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
    /** Current active step (0-based) */
    currentStep: number
    /** Callback when step change */
    onStepChange: (step: number) => void
}

/**
 * Registers tools for AI to navigate multi-step forms.
 * Tools: get_step, next_step, prev_step, go_to_step */
export function useFormikStepsTools(options: UseFormikStepsToolsOptions) {
    const { formId, steps, currentStep, onStepChange } = options

    const currentStepRef = useRef(currentStep)
    currentStepRef.current = currentStep

    const onStepChangeRef = useRef(onStepChange)
    onStepChangeRef.current = onStepChange

    useEffect(() => {
        const config: FormStepsConfig = { formId, steps }
        const state: FormStepsState = {
            getCurrentStep: () => currentStepRef.current,
            onStepChange: (step) => {
                onStepChangeRef.current(step)
            }
        }
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
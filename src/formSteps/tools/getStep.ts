import { defineTool } from "webmcp-adapter"
import { FormStepsConfig, FormStepsState } from "../types"

export const createGetStepTool = (config: FormStepsConfig, state: FormStepsState) => {
    return defineTool({
        name: `get_${config.formId}_step`,
        description: `Get the current step of the ${config.formId} form. Steps: ${config.steps.map((s, i) => `${i + 1}. ${s}`).join(', ')}`,
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        },
        execute: () => {
            const currentStep = state.getCurrentStep()
            const steps = config.steps
            const stepName = steps[currentStep]
            const isFirst = currentStep === 0
            const isLast = currentStep === steps.length - 1

            return {
                content: [{
                    type: "text",
                    text: `Step ${currentStep + 1} of ${steps.length}: "${stepName}"${isFirst ? ' (first step)' : ''}${isLast ? ' (last step)' : ''}`
                }],
                structuredContent: {
                    currentStep,
                    stepName,
                    totalSteps: steps.length,
                    isFirst,
                    isLast,
                    steps
                }
            }
        }
    })
}
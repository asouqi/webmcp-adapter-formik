import { FormStepsConfig, FormStepsState } from "../types"
import { defineTool } from "webmcp-adapter"


export const createPrevStepTool = (config: FormStepsConfig, state: FormStepsState) => {
    return defineTool({
        name: `prev_${config.formId}_step`,
        description: `Go to the previous step in the ${config.formId} form`,
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        },
        execute: () => {
            const currentStep = state.getCurrentStep()
            const steps = config.steps

            if (currentStep <= 0) {
                return {
                    content: [{
                        type: "text",
                        text: `Already at the first step: "${steps[currentStep]}"`
                    }],
                    structuredContent: { success: false, reason: 'already_at_first_step', currentStep }
                }
            }

            const prevStep = currentStep - 1
            state.onStepChange(prevStep)

            return {
                content: [{
                    type: "text",
                    text: `Moved to step ${prevStep + 1}: "${steps[prevStep]}"`
                }],
                structuredContent: { success: true, previousStep: currentStep, currentStep: prevStep, stepName: steps[prevStep] }
            }
        }
    })
}
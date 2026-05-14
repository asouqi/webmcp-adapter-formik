import {FormStepsConfig, FormStepsState} from "../types";
import {defineTool} from "webmcp-adapter";

export const createNextStepTool = (config: FormStepsConfig, state: FormStepsState) => {
    return defineTool({
        name: `next_${config.formId}_step`,
        description: `Go to the next step in the ${config.formId} form`,
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        },
        execute: () => {
            const currentStep = state.getCurrentStep()
            const steps = config.steps

            if (currentStep >= steps.length - 1) {
                return {
                    content: [{
                        type: "text",
                        text: `Already at the last step: "${steps[currentStep]}"`
                    }],
                    structuredContent: { success: false, reason: 'already_at_last_step', currentStep }
                }
            }

            const nextStep = currentStep + 1
            state.onStepChange(nextStep)
            return {
                content: [{
                    type: "text",
                    text: `Moved to step ${nextStep + 1}: "${steps[nextStep]}"`
                }],
                structuredContent: { success: true, previousStep: currentStep, currentStep: nextStep, stepName: steps[nextStep] }
            }
        }
    })
}
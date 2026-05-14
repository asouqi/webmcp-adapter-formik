import {FormStepsConfig, FormStepsState} from "../types";
import {defineTool} from "webmcp-adapter";

export const createGoToStepTool = (config: FormStepsConfig, state: FormStepsState) => {
    return defineTool({
        name: `go_to_${config.formId}_step`,
        description: `Go to a specific step in the ${config.formId} form by index (0-based) or name. Steps: ${config.steps.map((s, i) => `${i}: ${s}`).join(', ')}`,
        inputSchema: {
            type: "object",
            properties: {
                step: {
                    oneOf: [
                        { type: "number", description: "Step index (0-based)" },
                        { type: "string", description: "Step name" }
                    ],
                    description: "Step index or name"
                }
            },
            required: ["step"]
        },
        execute: ({ step }) => {
            const currentStep = state.getCurrentStep()
            const steps = config.steps

            const targetStep = typeof step === 'number' ? step :
                steps.findIndex(s => s.toLowerCase() === step.toLowerCase())

            if (targetStep < 0 || targetStep >= steps.length) {
                return {
                    content: [{
                        type: "text",
                        text: `Invalid step "${step}". Available steps: ${steps.map((s, i) => `${i}: ${s}`).join(', ')}`
                    }],
                    structuredContent: { success: false, reason: 'invalid_step', step }
                }
            }

            if (targetStep === currentStep) {
                return {
                    content: [{
                        type: "text",
                        text: `Already at step ${targetStep + 1}: "${steps[targetStep]}"`
                    }],
                    structuredContent: { success: false, reason: 'already_at_step', currentStep }
                }
            }

            state.onStepChange(targetStep)

            return {
                content: [{
                    type: "text",
                    text: `Moved to step ${targetStep + 1}: "${steps[targetStep]}"`
                }],
                structuredContent: { success: true, previousStep: currentStep, currentStep: targetStep, stepName: steps[targetStep] }
            }
        }
    })
}
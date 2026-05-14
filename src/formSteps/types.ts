
export interface FormStepsConfig {
    formId: string
    steps: string[]
}

export interface FormStepsState {
    getCurrentStep: () => number
    onStepChange: (step: number) => void
}
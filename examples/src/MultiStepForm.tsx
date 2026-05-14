import { useState } from 'react'
import {Formik, Form, Field, useFormikContext} from 'formik'
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Box,
    Card,
    CardContent,
    Typography
} from '@mui/material'
import { useFormikStepsTools } from '../../src'
import { FormField } from "webmcp-forms"

// Step definitions
const steps = ['Personal Info', 'Address', 'Review']

const fields: Record<string, FormField> = {
    // Step 0: Personal Info
    firstName: { type: 'string', required: true, minLength: 2 },
    lastName: { type: 'string', required: true, minLength: 2 },
    email: { type: 'string', required: true },
    // Step 1: Address
    street: { type: 'string', required: true },
    city: { type: 'string', required: true },
    zipCode: { type: 'string', required: true },
    // Step 2: Review (no fields, just confirmation)
}

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    zipCode: ''
}

// Validation per step
const validateStep = (step: number, values: typeof initialValues) => {
    const errors: Record<string, string> = {}

    if (step === 0) {
        if (!values.firstName) errors.firstName = 'Required'
        if (!values.lastName) errors.lastName = 'Required'
        if (!values.email) errors.email = 'Required'
        else if (!/^[^@]+@[^@]+\.[^@]+$/.test(values.email)) errors.email = 'Invalid email'
    }

    if (step === 1) {
        if (!values.street) errors.street = 'Required'
        if (!values.city) errors.city = 'Required'
        if (!values.zipCode) errors.zipCode = 'Required'
    }

    return errors
}

export function MultiStepForm() {
    const [activeStep, setActiveStep] = useState(0)

    return (
        <Formik
            initialValues={initialValues}
            validate={(values) => validateStep(activeStep, values)}
            onSubmit={(values) => {
                console.log('Submitted:', values)
                alert('Form submitted!\n\n' + JSON.stringify(values, null, 2))
            }}
        >
            <FormContent
                activeStep={activeStep}
                setActiveStep={setActiveStep}
            />
        </Formik>
    )
}

interface FormContentProps {
    activeStep: number
    setActiveStep: (step: number) => void
}

function FormContent({ activeStep, setActiveStep }: FormContentProps) {
    // Register WebMCP tools
    useFormikStepsTools({
        formId: 'registration',
        steps,
        currentStep: activeStep,
        onStepChange: (step) => setActiveStep(step)
    })

    return (
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Registration Form
                </Typography>

                {/* Stepper */}
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Form>
                    {/* Step 0: Personal Info */}
                    {activeStep === 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Field
                                as={TextField}
                                name="firstName"
                                label="First Name"
                                fullWidth
                            />
                            <Field
                                as={TextField}
                                name="lastName"
                                label="Last Name"
                                fullWidth
                            />
                            <Field
                                as={TextField}
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                            />
                        </Box>
                    )}

                    {/* Step 1: Address */}
                    {activeStep === 1 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Field
                                as={TextField}
                                name="street"
                                label="Street Address"
                                fullWidth
                            />
                            <Field
                                as={TextField}
                                name="city"
                                label="City"
                                fullWidth
                            />
                            <Field
                                as={TextField}
                                name="zipCode"
                                label="Zip Code"
                                fullWidth
                            />
                        </Box>
                    )}

                    {/* Step 2: Review */}
                    {activeStep === 2 && (
                        <ReviewStep />
                    )}

                    {/* Navigation Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={() => setActiveStep(activeStep - 1)}
                        >
                            Back
                        </Button>

                        {activeStep === steps.length - 1 ? (
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => setActiveStep(activeStep + 1)}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Form>
            </CardContent>
        </Card>
    )
}

function ReviewStep() {
    const { values } = useFormikContext<typeof initialValues>()

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Review Your Information</Typography>

            <Typography><strong>Name:</strong> {values.firstName} {values.lastName}</Typography>
            <Typography><strong>Email:</strong> {values.email}</Typography>
            <Typography><strong>Address:</strong> {values.street}, {values.city} {values.zipCode}</Typography>
        </Box>
    )
}
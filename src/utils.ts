import { FormField } from "webmcp-forms"
import {JsonValue} from "webmcp-adapter"

// TODO:: export them
// import {buildFieldValueSchema, fieldDescription} from "webmcp-forms/dist/utils"

/**
 * Builds a JSON Schema from a FormField definition.
 * Used by fillField (for tool input validation) and validateForm (for value validation).
 */
export function buildFieldSchema(field: FormField): Record<string, JsonValue> {
    const schema: Record<string, JsonValue> = {}

    switch (field.type) {
        case 'string':
            schema.type = 'string'
            if (field.minLength !== undefined) schema.minLength = field.minLength
            if (field.maxLength !== undefined) schema.maxLength = field.maxLength
            if (field.pattern) schema.pattern = field.pattern
            if (field.options) schema.enum = field.options
            break

        case 'number':
            schema.type = 'number'
            if (field.min !== undefined) schema.minimum = field.min
            if (field.max !== undefined) schema.maximum = field.max
            if (field.step !== undefined) schema.multipleOf = field.step
            if (field.options) schema.enum = field.options.map(Number)
            break

        case 'boolean':
            schema.type = 'boolean'
            break

        case 'array':
            schema.type = 'array'
            if (field.minItems !== undefined) schema.minItems = field.minItems
            if (field.maxItems !== undefined) schema.maxItems = field.maxItems
            break

        case 'object':
            schema.type = 'object'
            break
    }

    return schema
}

/**
 * Builds a schema that allows null for optional fields (used in fillField tool).
 */
export function buildFieldValueSchema(field: FormField): Record<string, JsonValue> {
    const schema = buildFieldSchema(field)

    // Required fields: return schema as-is
    if (field.required) {
        return schema
    }

    // Optional fields: allow null to clear the field
    return {
        oneOf: [
            schema,
            { type: 'null' }
        ]
    }
}

/**
 * Generates human-readable field descriptions for AI tool descriptions
 */
export function fieldDescription(fields: Record<string, FormField>): string {
    return Object.entries(fields).map(([name, field]) => {
        let desc = `- ${name} (${field.type})`
        if (field.label) desc += `: ${field.label}`
        if (field.options) desc += ` [options: ${field.options.join(', ')}]`
        if (field.min !== undefined) desc += ` [min: ${field.min}]`
        if (field.max !== undefined) desc += ` [max: ${field.max}]`
        if (field.minLength !== undefined) desc += ` [minLength: ${field.minLength}]`
        if (field.maxLength !== undefined) desc += ` [maxLength: ${field.maxLength}]`
        if (field.required) desc += ` (required)`
        if (field.defaultValue !== undefined) desc += ` [default: ${JSON.stringify(field.defaultValue)}]`
        return desc
    }).join('\n')
}


export function buildItemSchema(itemFields: Record<string, FormField>) {
    const properties: Record<string, any> = {}
    const required: string[] = []

    for (const [fieldName, fieldConfig] of Object.entries(itemFields)) {
        properties[fieldName] = buildFieldValueSchema(fieldConfig)
        if (fieldConfig.required) required.push(fieldName)
    }

    return { type: 'object', properties, required }
}

export function buildIndexSchema(items: any[], label = 'index') {
    return {
        type: 'number',
        minimum: 0,
        maximum: Math.max(0, items.length - 1),
        description: `${label} of the item (0-based)`
    }
}

export function itemDescription(itemFields: Record<string, FormField>) {
    return Object.entries(itemFields)
        .map(([name, config]) => `- ${name}: ${fieldDescription({ [name]: config })}`)
        .join('\n')
}
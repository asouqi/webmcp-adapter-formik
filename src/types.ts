import {FormField} from "webmcp-forms"
import {JsonValue, ToolDefinition} from "webmcp-adapter";

export type FieldArrayTools =
    | 'get-items'
    | 'add-item'
    | 'insert-item'
    | 'remove-item'
    | 'update-item'
    | 'move-item'
    | 'swap-items'
    | 'clear-items'

export interface UseFormikFieldArrayToolsOptions {
    formId: string
    fieldName: string
    itemFields: Record<string, FormField>
    maxItems?: number
    minItems?: number
    validationSchema?: any
    selectedTools?: Set<FieldArrayTools>
    customTools?: ToolDefinition[]
}

export interface FieldArrayConfig {
    formId: string
    fieldName: string
    itemFields: Record<string, FormField>
    maxItems?: number
    minItems?: number
    validationSchema?: any
    selectedTools?: Set<FieldArrayTools>
}

export interface FieldArrayState {
    getItems: () => JsonValue[]
    onChange: (items: JsonValue[]) => void
}
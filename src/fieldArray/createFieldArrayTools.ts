import { ToolDefinition } from "webmcp-adapter"
import { FormField } from "webmcp-forms"
import { FieldArrayConfig, FieldArrayState, FieldArrayTools } from "../types"
import {
    createAddItemTool,
    createClearItemsTool,
    createGetItemsTool,
    createInsertItemTool,
    createMoveItemTool,
    createRemoveItemTool,
    createSwapItemsTool,
    createUpdateItemTool
} from "./tools"

const TOOL_CREATORS: Record<FieldArrayTools, (config: FieldArrayConfig, state: FieldArrayState) => ToolDefinition> = {
    'get-items': createGetItemsTool,
    'add-item': createAddItemTool,
    'insert-item': createInsertItemTool,
    'remove-item': createRemoveItemTool,
    'update-item': createUpdateItemTool,
    'move-item': createMoveItemTool,
    'swap-items': createSwapItemsTool,
    'clear-items': createClearItemsTool,
}

export interface CreateFieldArrayToolsOptions {
    /** The parent form id — must match the useFormikTools formId */
    formId: string
    /** The field name of the array in the form values e.g. 'addresses', 'items' */
    fieldName: string
    /** Schema for a single array item */
    itemFields: Record<string, FormField>
    /** Current array values */
    getItems: () => any[]
    /** Callback to update the array */
    onChange: (items: any[]) => void
    /** Maximum number of items allowed */
    maxItems?: number
    /** Minimum number of items required */
    minItems?: number
    /** Standard schema for a single item validation */
    validationSchema?: any
    /** Specific tools to include (defaults to all) */
    selectedTools?: Set<FieldArrayTools>
    /** Additional custom tools to include */
    customTools?: ToolDefinition[]
}


export function createFieldArrayTools(options: CreateFieldArrayToolsOptions): ToolDefinition[] {
    const {
        formId,
        fieldName,
        itemFields,
        getItems,
        onChange,
        maxItems,
        minItems,
        validationSchema,
        selectedTools,
        customTools = []
    } = options

    const config: FieldArrayConfig = {
        formId,
        fieldName,
        itemFields,
        maxItems,
        minItems,
        validationSchema,
    }

    const state: FieldArrayState = {
        getItems,
        onChange
    }

    const keys = selectedTools ? Array.from(selectedTools.keys()) : Object.keys(TOOL_CREATORS) as FieldArrayTools[]
    const tools = keys.map(key => TOOL_CREATORS[key](config, state)).filter(Boolean)
    return [...customTools, ...tools]
}
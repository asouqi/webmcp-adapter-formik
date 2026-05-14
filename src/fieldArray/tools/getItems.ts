import { defineTool } from "webmcp-adapter"
import { FieldArrayConfig, FieldArrayState } from "../../types"

export function createGetItemsTool(config: FieldArrayConfig, state: FieldArrayState) {
    return defineTool({
        name: `get_${config.formId}_${config.fieldName}_items`,
        description: `Get all current items in the ${config.fieldName} array of the ${config.formId} form.`,
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        execute: () => {
            const items = state.getItems()
            return {
                content: [{ type: 'text', text: `${config.fieldName} has ${items.length} item(s).` }],
                structuredContent: {
                    fieldName: config.fieldName,
                    items,
                    count: items.length,
                    minItems: config.minItems,
                    maxItems: config.maxItems,
                }
            }
        }
    })
}
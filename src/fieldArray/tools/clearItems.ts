import { defineTool } from "webmcp-adapter"
import { FieldArrayConfig, FieldArrayState } from "../../types"

export function createClearItemsTool(config: FieldArrayConfig, state: FieldArrayState) {
    return defineTool({
        name: `clear_${config.formId}_${config.fieldName}_items`,
        description: `Remove all items from ${config.fieldName} in the ${config.formId} form.${config.minItems ? ` Minimum ${config.minItems} item(s) will be kept.` : ''}`,
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        },
        execute: () => {
            const items = state.getItems()
            const keepCount = config.minItems ?? 0
            const newItems = items.slice(0, keepCount)
            state.onChange(newItems)

            const cleared = items.length - newItems.length
            return {
                content: [{
                    type: 'text',
                    text: keepCount > 0
                        ? `Cleared ${cleared} item(s) from ${config.fieldName}. Kept ${keepCount} minimum required item(s).`
                        : `Cleared all ${cleared} item(s) from ${config.fieldName}.`
                }],
                structuredContent: {
                    success: true,
                    clearedCount: cleared,
                    remainingCount: newItems.length
                }
            }
        }
    })
}
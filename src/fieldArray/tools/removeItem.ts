import { defineTool } from "webmcp-adapter"
import { FieldArrayConfig, FieldArrayState } from "../../types"

export function createRemoveItemTool(config: FieldArrayConfig, state: FieldArrayState) {
    return defineTool({
        name: `remove_${config.formId}_${config.fieldName}_item`,
        description: `Remove an item at a specific index from ${config.fieldName} in the ${config.formId} form.`,
        inputSchema: {
            type: 'object',
            properties: {
                index: {
                    type: 'number',
                    minimum: 0,
                    description: 'Index of the item to remove (0-based)'
                }
            },
            required: ['index']
        },
        execute: ({ index }) => {
            const items = state.getItems()
            const idx = index as number

            if (idx < 0 || idx >= items.length) {
                return {
                    content: [{ type: 'text', text: `Invalid index ${idx}. Array has ${items.length} items.` }],
                    isError: true
                }
            }

            if (config.minItems !== undefined && items.length <= config.minItems) {
                return {
                    content: [{ type: 'text', text: `Cannot remove item: ${config.fieldName} already has the minimum of ${config.minItems} items.` }],
                    isError: true
                }
            }

            const newItems = items.filter((_, i) => i !== idx)
            state.onChange(newItems)

            return {
                content: [{ type: 'text', text: `Removed item at index ${idx} from ${config.fieldName}.` }],
                structuredContent: {
                    success: true,
                    removedIndex: idx,
                    removedItem: items[idx],
                    count: newItems.length
                }
            }
        }
    })
}
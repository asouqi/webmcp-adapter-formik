import { defineTool } from "webmcp-adapter"
import { FieldArrayConfig, FieldArrayState } from "../../types"

export function createSwapItemsTool(config: FieldArrayConfig, state: FieldArrayState) {
    return defineTool({
        name: `swap_${config.formId}_${config.fieldName}_items`,
        description: `Swap two items by index in ${config.fieldName} of the ${config.formId} form.`,
        inputSchema: {
            type: 'object',
            properties: {
                indexA: {
                    type: 'number',
                    minimum: 0,
                    description: 'Index of the first item (0-based)'
                },
                indexB: {
                    type: 'number',
                    minimum: 0,
                    description: 'Index of the second item (0-based)'
                }
            },
            required: ['indexA', 'indexB']
        },
        execute: ({ indexA, indexB }) => {
            const items = state.getItems()
            const a = indexA as number
            const b = indexB as number

            if (a < 0 || a >= items.length || b < 0 || b >= items.length) {
                return {
                    content: [{ type: 'text', text: `Invalid indices. Array has ${items.length} items.` }],
                    isError: true
                }
            }

            if (a === b) {
                return {
                    content: [{ type: 'text', text: `Both indices are the same (${a}), nothing to swap.` }],
                    structuredContent: { success: true, indexA: a, indexB: b, count: items.length }
                }
            }

            const newItems = [...items]
            ;[newItems[a], newItems[b]] = [newItems[b], newItems[a]]
            state.onChange(newItems)

            return {
                content: [{ type: 'text', text: `Swapped items at index ${a} and ${b} in ${config.fieldName}.` }],
                structuredContent: {
                    success: true,
                    indexA: a,
                    indexB: b,
                    count: newItems.length
                }
            }
        }
    })
}
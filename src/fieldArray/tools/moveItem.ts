import { defineTool } from "webmcp-adapter"
import { FieldArrayConfig, FieldArrayState } from "../../types"

export function createMoveItemTool(config: FieldArrayConfig, state: FieldArrayState) {
    return defineTool({
        name: `move_${config.formId}_${config.fieldName}_item`,
        description: `Move an item from one index to another in ${config.fieldName} of the ${config.formId} form.`,
        inputSchema: {
            type: 'object',
            properties: {
                from: {
                    type: 'number',
                    minimum: 0,
                    description: 'Index of the item to move (0-based)'
                },
                to: {
                    type: 'number',
                    minimum: 0,
                    description: 'Destination index (0-based)'
                }
            },
            required: ['from', 'to']
        },
        execute: ({ from, to }) => {
            const items = state.getItems()
            const fromIdx = from as number
            const toIdx = to as number

            if (fromIdx < 0 || fromIdx >= items.length) {
                return {
                    content: [{ type: 'text', text: `Invalid from index ${fromIdx}. Array has ${items.length} items.` }],
                    isError: true
                }
            }

            if (toIdx < 0 || toIdx >= items.length) {
                return {
                    content: [{ type: 'text', text: `Invalid to index ${toIdx}. Array has ${items.length} items.` }],
                    isError: true
                }
            }

            if (fromIdx === toIdx) {
                return {
                    content: [{ type: 'text', text: `Item is already at index ${fromIdx}.` }],
                    structuredContent: { success: true, from: fromIdx, to: toIdx, count: items.length }
                }
            }

            const newItems = [...items]
            const [moved] = newItems.splice(fromIdx, 1)
            newItems.splice(toIdx, 0, moved)
            state.onChange(newItems)

            return {
                content: [{ type: 'text', text: `Moved item from index ${fromIdx} to ${toIdx} in ${config.fieldName}.` }],
                structuredContent: {
                    success: true,
                    from: fromIdx,
                    to: toIdx,
                    movedItem: moved,
                    count: newItems.length
                }
            }
        }
    })
}
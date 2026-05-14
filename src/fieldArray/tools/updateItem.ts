import {defineTool, JsonValue} from "webmcp-adapter"
import { FieldArrayConfig, FieldArrayState } from "../../types"
import { buildItemSchema, itemDescription } from "../../utils"

export function createUpdateItemTool(config: FieldArrayConfig, state: FieldArrayState) {
    return defineTool({
        name: `update_${config.formId}_${config.fieldName}_item`,
        description: `Replace an item at a specific index in ${config.fieldName} of the ${config.formId} form.\n\nItem fields:\n${itemDescription(config.itemFields)}`,
        inputSchema: {
            type: 'object',
            properties: {
                index: {
                    type: 'number',
                    minimum: 0,
                    description: 'Index of the item to update (0-based)'
                },
                item: buildItemSchema(config.itemFields)
            },
            required: ['index', 'item']
        },
        validator: config.validationSchema,
        execute: ({ index, item }) => {
            const items = state.getItems()
            const idx = index as number

            if (idx < 0 || idx >= items.length) {
                return {
                    content: [{ type: 'text', text: `Invalid index ${idx}. Array has ${items.length} items.` }],
                    isError: true
                }
            }

            const newItems = items.map((existing, i) => i === idx ? (item as JsonValue) : existing)
            state.onChange(newItems)

            return {
                content: [{ type: 'text', text: `Updated item at index ${idx} in ${config.fieldName}.` }],
                structuredContent: {
                    success: true,
                    index: idx,
                    previousItem: items[idx],
                    updatedItem: item as JsonValue,
                    count: newItems.length
                }
            }
        }
    })
}
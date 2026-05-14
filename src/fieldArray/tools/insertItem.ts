import {defineTool, JsonValue} from "webmcp-adapter"
import { FieldArrayConfig, FieldArrayState } from "../../types"
import { buildItemSchema, itemDescription } from "../../utils"

export function createInsertItemTool(config: FieldArrayConfig, state: FieldArrayState) {
    return defineTool({
        name: `insert_${config.formId}_${config.fieldName}_item`,
        description: `Insert a new item at a specific index in ${config.fieldName} of the ${config.formId} form.\n\nItem fields:\n${itemDescription(config.itemFields)}`,
        inputSchema: {
            type: 'object',
            properties: {
                index: {
                    type: 'number',
                    minimum: 0,
                    description: 'Index to insert the item at (0-based). Existing items shift right.'
                },
                item: buildItemSchema(config.itemFields)
            },
            required: ['index', 'item']
        },
        validator: config.validationSchema,
        execute: ({ index, item }) => {
            const items = state.getItems()

            if (config.maxItems !== undefined && items.length >= config.maxItems) {
                return {
                    content: [{ type: 'text', text: `Cannot insert item: ${config.fieldName} already has the maximum of ${config.maxItems} items.` }],
                    isError: true
                }
            }

            const idx = index as number
            if (idx < 0 || idx > items.length) {
                return {
                    content: [{ type: 'text', text: `Invalid index ${idx}. Must be between 0 and ${items.length}.` }],
                    isError: true
                }
            }

            const newItems = [...items.slice(0, idx), item as JsonValue, ...items.slice(idx)]
            state.onChange(newItems)

            return {
                content: [{ type: 'text', text: `Inserted item at index ${idx} in ${config.fieldName}.` }],
                structuredContent: {
                    success: true,
                    index: idx,
                    item: item as JsonValue,
                    count: newItems.length
                }
            }
        }
    })
}
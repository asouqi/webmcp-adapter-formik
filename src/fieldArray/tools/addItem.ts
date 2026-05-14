import {defineTool, JsonValue} from "webmcp-adapter"
import { FieldArrayConfig, FieldArrayState } from "../../types"
import { buildItemSchema, itemDescription } from "../../utils"

export function createAddItemTool(config: FieldArrayConfig, state: FieldArrayState) {
    return defineTool({
        name: `add_${config.formId}_${config.fieldName}_item`,
        description: `Add a new item to the end of ${config.fieldName} in the ${config.formId} form.\n\nItem fields:\n${itemDescription(config.itemFields)}`,
        inputSchema: {
            type: 'object',
            properties: {
                item: buildItemSchema(config.itemFields)
            },
            required: ['item']
        },
        validator: config.validationSchema,
        execute: ({ item }) => {
            const items = state.getItems()

            if (config.maxItems !== undefined && items.length >= config.maxItems) {
                return {
                    content: [{ type: 'text', text: `Cannot add item: ${config.fieldName} already has the maximum of ${config.maxItems} items.` }],
                    isError: true
                }
            }

            const newItems = [...items, item as JsonValue]
            state.onChange(newItems)

            return {
                content: [{ type: 'text', text: `Added new item to ${config.fieldName} at index ${items.length}.` }],
                structuredContent: {
                    success: true,
                    index: items.length,
                    item: item as JsonValue,
                    count: newItems.length
                }
            }
        }
    })
}
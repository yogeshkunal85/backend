const { z } = require('zod');

const orderItemSchema = z.object({
  menuItemId: z.string().min(1, 'menuItemId is required'),
  quantity: z.number().int().min(1, 'quantity must be at least 1'),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1, 'customerName is required'),
  address: z.string().min(1, 'address is required'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'phone must be a valid 10-digit number'),
  items: z.array(orderItemSchema).min(1, 'items must not be empty'),
});

function formatZodErrors(error) {
  return error.errors.map((err) => ({
    field: err.path.join('.') || 'body',
    message: err.message,
  }));
}

function validateCreateOrder(body) {
  const result = createOrderSchema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: formatZodErrors(result.error) };
}

module.exports = { createOrderSchema, validateCreateOrder, formatZodErrors };

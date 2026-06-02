const { v4: uuidv4 } = require('uuid');
const { getMenuItemById } = require('../data/menuItems');
const { getOrder, saveOrder } = require('../data/orders');
const { validateCreateOrder } = require('../validators/orderValidator');
const { startStatusStream } = require('../utils/statusSimulator');

function buildOrderItems(items) {
  return items.map((item) => {
    const menuItem = getMenuItemById(item.menuItemId);
    if (!menuItem) {
      const error = new Error(`Menu item not found: ${item.menuItemId}`);
      error.statusCode = 400;
      throw error;
    }
    return {
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
    };
  });
}

function calculateTotal(orderItems) {
  return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function createOrder(req, res, next) {
  try {
    const validation = validateCreateOrder(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.errors });
    }

    const orderItems = buildOrderItems(validation.data.items);
    const order = {
      id: uuidv4(),
      customerName: validation.data.customerName,
      address: validation.data.address,
      phone: validation.data.phone,
      items: orderItems,
      totalAmount: calculateTotal(orderItems),
      status: 'Order Received',
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);
    return res.status(201).json(order);
  } catch (err) {
    return next(err);
  }
}

function getOrderById(req, res) {
  const order = getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  return res.status(200).json(order);
}

function getOrderStatus(req, res) {
  const order = getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  return res.status(200).json({ status: order.status });
}

function streamOrderStatus(req, res) {
  const order = getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const started = startStatusStream(req.params.id, res);
  if (!started) {
    return res.status(404).json({ message: 'Order not found' });
  }

  return undefined;
}

module.exports = {
  createOrder,
  getOrderById,
  getOrderStatus,
  streamOrderStatus,
};

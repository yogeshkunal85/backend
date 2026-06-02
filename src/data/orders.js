const orders = new Map();

function getOrder(id) {
  return orders.get(id);
}

function saveOrder(order) {
  orders.set(order.id, order);
  return order;
}

function updateOrderStatus(id, status) {
  const order = orders.get(id);
  if (!order) return null;
  order.status = status;
  orders.set(id, order);
  return order;
}

function resetOrders() {
  orders.clear();
}

module.exports = {
  getOrder,
  saveOrder,
  updateOrderStatus,
  resetOrders,
};

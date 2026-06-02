const { getOrder, updateOrderStatus } = require('../data/orders');

const STATUS_FLOW = [
  'Order Received',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

const INTERVAL_MS = 15000;

const activeStreams = new Map();

function getNextStatus(currentStatus) {
  const index = STATUS_FLOW.indexOf(currentStatus);
  if (index === -1 || index >= STATUS_FLOW.length - 1) {
    return null;
  }
  return STATUS_FLOW[index + 1];
}

function sendSseEvent(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function stopStream(orderId) {
  const stream = activeStreams.get(orderId);
  if (!stream) return;
  clearInterval(stream.intervalId);
  activeStreams.delete(orderId);
}

function startStatusStream(orderId, res) {
  const order = getOrder(orderId);
  if (!order) return false;

  sendSseEvent(res, { status: order.status });

  const intervalId = setInterval(() => {
    const current = getOrder(orderId);
    if (!current) {
      stopStream(orderId);
      res.end();
      return;
    }

    const nextStatus = getNextStatus(current.status);
    if (!nextStatus) {
      stopStream(orderId);
      res.end();
      return;
    }

    const updated = updateOrderStatus(orderId, nextStatus);
    sendSseEvent(res, { status: updated.status });

    if (nextStatus === 'Delivered') {
      stopStream(orderId);
      res.end();
    }
  }, INTERVAL_MS);

  activeStreams.set(orderId, { intervalId, res });

  res.on('close', () => {
    stopStream(orderId);
  });

  return true;
}

module.exports = {
  STATUS_FLOW,
  INTERVAL_MS,
  getNextStatus,
  startStatusStream,
  stopStream,
};

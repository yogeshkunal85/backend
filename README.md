# FoodDash API (Backend)

Express REST API for the food delivery Order Management app. Handles menu data, order creation, and real-time order status updates via Server-Sent Events (SSE).

## Tech stack

- Node.js + Express
- Zod (request validation)
- In-memory order storage
- Jest + Supertest (tests)

## Prerequisites

- Node.js 18+

## Setup

```bash
cd backend
npm install
```

## Scripts

| Command       | Description                          |
|---------------|--------------------------------------|
| `npm run dev` | Start server with nodemon (port 3000) |
| `npm start`   | Start server (production)            |
| `npm test`    | Run Jest test suite                  |

Default port: **3000** (override with `PORT` env var).

## Project structure

```
src/
  server.js              # Entry point
  app.js                 # Express app + middleware
  routes/
    menu.js              # GET /api/menu
    orders.js            # Order routes
  controllers/
    menuController.js
    orderController.js
  data/
    menuItems.js         # Static menu catalog
    orders.js            # In-memory order store
  validators/
    orderValidator.js
  utils/
    statusSimulator.js   # SSE status progression
tests/
  menu.test.js
  orders.test.js
```

## API endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| GET    | `/`                         | Health check `{ status: "ok" }` |
| GET    | `/api/menu`                 | List all menu items            |
| POST   | `/api/orders`               | Create a new order             |
| GET    | `/api/orders/:id`           | Get order by ID                |
| GET    | `/api/orders/:id/status`    | Get order status only          |
| GET    | `/api/orders/:id/stream`    | SSE stream of status updates   |

### Create order

**POST** `/api/orders`

```json
{
  "customerName": "Jane Doe",
  "address": "123 Main St",
  "phone": "9876543210",
  "items": [
    { "menuItemId": "burger-1", "quantity": 2 }
  ]
}
```

**Validation rules**

- `customerName` — required string
- `address` — required string
- `phone` — exactly 10 digits
- `items` — non-empty array; each item needs `menuItemId` and `quantity` ≥ 1

**Response:** `201` with full order object (`id`, `status: "Order Received"`, `totalAmount`, `createdAt`, etc.)

**Errors:** `400` with `{ errors: [{ field, message }] }`

### Order status flow (SSE)

Statuses advance automatically every **15 seconds**:

1. Order Received  
2. Preparing  
3. Out for Delivery  
4. Delivered  

The stream sends JSON events: `data: {"status":"Preparing"}\n\n`

## Running with the frontend

Start the API first, then run the React app in `../client` (it expects `http://localhost:3000/api`).

```bash
# Terminal 1
npm run dev

# Terminal 2 (from repo root)
npm run dev:client
```

# AI Sales Agent Implementation Plan

## Goal
Create an autonomous sales assistant powered by OpenAI that can:
1. Answer customer questions about products.
2. Access the full product inventory.
3. Add selected items to a shopping cart.
4. Generate a payment link (editable) that supports:
   - Standard online payment (e.g., Stripe).
   - Cash‑on‑Delivery (COD) with scheduling on an external platform.
5. Send the payment link back to the customer via the chat interface.

## High‑Level Architecture
```
User (Web) ↔️ Frontend (React/Vue) ↔️ Backend (Node/Express) ↔️ OpenAI API
                                 ↕️ Database (PostgreSQL/SQLite)
                                 ↕️ Payment Provider (Stripe) / External COD Scheduler
```

### 1. Backend Services
- **/api/chat** – Receives user messages, forwards to OpenAI, returns assistant reply.
- **/api/inventory** – CRUD endpoints for products (already exists in [admin/data.js](file:///c:/Users/Meire/Downloads/pv%20progressiva/admin/data.js) – will be migrated to DB).
- **/api/cart** – Session‑based cart (add, remove, list).
- **/api/payment-link** – Creates a payment session:
  - For online payment → Stripe Checkout Session URL.
  - For COD → Generates a custom URL to the external scheduling platform (configurable per product).

### 2. OpenAI Prompt Engineering
Create a system prompt that gives the model context and tools:
```text
You are a sales assistant for "Casa da Progressiva". You have access to the following functions:
- getInventory(): returns list of products with id, name, price, stock, paymentType (online|cod).
- addToCart(productId, qty): adds item to the user's cart.
- createPaymentLink(cartId): returns a URL. If any item is COD, the URL should point to the external scheduler; otherwise a Stripe checkout URL.
When the user asks to buy something, call the appropriate functions and respond with the generated link.
```
The backend will expose these functions via a **function calling** interface (OpenAI function calling feature).

### 3. Data Model (SQL example)
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL,
  payment_type TEXT CHECK (payment_type IN ('online','cod')) DEFAULT 'online',
  cod_schedule_url TEXT NULL -- URL of external platform for COD scheduling
);

CREATE TABLE carts (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  cart_id TEXT REFERENCES carts(id),
  product_id TEXT REFERENCES products(id),
  quantity INTEGER NOT NULL,
  PRIMARY KEY (cart_id, product_id)
);
```

### 4. Payment Link Generation
- **Online**: Use Stripe SDK to create a Checkout Session with line items from the cart.
- **COD**: If any cart item has `payment_type='cod'`, concatenate the `cod_schedule_url` of those products (or a generic URL) and return it.
- The link can be edited later by updating the product's `cod_schedule_url` in the admin panel (new field added).

### 5. Frontend Integration
- Add a chat widget (e.g., BotUI or custom component).
- When the user sends a message, POST to `/api/chat`.
- Display assistant replies and, when a payment link is returned, show a clickable button.

### 6. Admin Panel Extensions
- Extend [admin/index.html](file:///c:/Users/Meire/Downloads/pv%20progressiva/admin/index.html) with a new **"Loja & Pixels"** section (already added) to include:
  - **Payment Settings**: Stripe secret key, default COD schedule URL.
  - **Product Edit**: field `payment_type` (online/cod) and optional `cod_schedule_url`.
- Store these settings in `storeSettings` (already added) and persist in DB.

### 7. Security & Privacy
- Authenticate admin routes (basic auth or JWT).
- Secure the OpenAI API key (environment variable).
- Use HTTPS for all endpoints.
- Validate and sanitize all inputs (product IDs, quantities).

## Implementation Steps (MVP)
1. **Create backend skeleton** (`server/` folder, Express, dotenv).
2. **Migrate existing product data** from [admin/data.js](file:///c:/Users/Meire/Downloads/pv%20progressiva/admin/data.js) to the new DB.
3. **Implement inventory and cart APIs**.
4. **Integrate OpenAI function calling** in `/api/chat`.
5. **Add Stripe integration** (test keys) and COD URL handling.
6. **Update admin UI** to manage `payment_type` and `cod_schedule_url`.
7. **Add chat widget** to the public site.
8. **Test end‑to‑end flow**: user asks for a product → assistant adds to cart → generates link → user pays.

## Open Questions for You
- Which payment provider(s) do you prefer for online payments? (Stripe is the most straightforward.)
- Do you have an existing external platform for COD scheduling? If so, please provide its URL pattern.
- Should the AI be able to handle returns/exchanges, or only initial purchase?
- Do you want the chat widget to be visible on all pages or only on product pages?

Once we have your answers, we can start creating the backend files and update the admin panel accordingly.

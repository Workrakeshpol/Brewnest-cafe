# API

## Overview
The BrewNest backend follows a **RESTful** design under the base path ` /api/v1/ `. All responses are JSON objects wrapped by a standard envelope:
```json
{ "success": true, "data": <payload>, "error": null }
```
Error responses use the same envelope with `success: false` and an `error` object containing `code`, `message`, and optional `details`.

## Authentication
- **Register** – `POST /auth/register` – public.
- **Login** – `POST /auth/login` – public, returns `accessToken` (Bearer) and sets an httpOnly `refreshToken` cookie.
- **Refresh Token** – `POST /auth/refresh-token` – uses refresh cookie, returns new access token.
- **Logout** – `POST /auth/logout` – clears refresh cookie.
- **Protected routes** – require `Authorization: Bearer <accessToken>` header.
- **Role‑based access** – middleware `authorize(...roles)` restricts access to `admin`, `manager`, `staff`, `customer`.

## Endpoints
Below is a non‑exhaustive list of the most important routes. For a full OpenAPI spec, see `openapi.yaml` (generated via `npm run docs`).

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register a new user (email, password, profile). |
| `POST` | `/auth/login` | ❌ | Authenticate and receive JWT access token. |
| `POST` | `/auth/refresh-token` | ❌ | Refresh access token using httpOnly refresh cookie. |
| `POST` | `/auth/logout` | ❌ | Invalidate refresh token (cookie cleared). |
| `POST` | `/auth/forgot-password` | ❌ | Send password‑reset email (mocked in dev). |
| `POST` | `/auth/reset-password` | ❌ | Reset password with token. |
| `GET`  | `/auth/me` | ✅ | Return current user profile. |

**Example – Register**
```http
POST /api/v1/auth/register HTTP/1.1
Content-Type: application/json

{ "email": "demo@example.com", "password": "Password123!", "firstName": "Demo", "lastName": "User" }
```
**Response**
```json
{ "success": true, "data": { "id": "uuid", "email": "demo@example.com", "role": "customer" }, "error": null }
```

### Menu
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/menu/categories` | ❌ | List all menu categories. |
| `GET` | `/menu/items` | ❌ | List menu items (supports `?category=`, `?available=` filters). |
| `GET` | `/menu/items/:idOrSlug` | ❌ | Retrieve a single menu item (by UUID or slug). |
| `POST` | `/menu/categories` | ✅ (manager) | Create a new category. |
| `POST` | `/menu/items` | ✅ (manager) | Create a new menu item. |
| `PUT` | `/menu/items/:id` | ✅ (manager) | Update an existing item (partial allowed). |
| `PATCH` | `/menu/items/:id/availability` | ✅ (staff) | Toggle `isAvailable` flag. |
| `DELETE` | `/menu/items/:id` | ✅ (manager) | Delete a menu item (soft‑delete). |

**Example – Get Items**
```http
GET /api/v1/menu/items?category=coffee&available=true HTTP/1.1
Accept: application/json
```
**Response**
```json
{ "success": true, "data": [{ "id": "uuid", "name": "Espresso", "basePrice": "3.00", "isAvailable": true }], "error": null }
```

### Cart
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/cart` | ✅ | Retrieve current user's cart. |
| `POST` `/cart/items` | ✅ | Add an item (quantity, variant). |
| `PUT` `/cart/items/:id` | ✅ | Update quantity or variants. |
| `DELETE` `/cart/items/:id` | ✅ | Remove a single item. |
| `DELETE` `/cart` | ✅ | Clear the whole cart. |

### Orders
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/orders` | ✅ | Create a new order (checkout). |
| `GET` | `/orders` | ✅ | List current user's orders (paginated). |
| `GET` | `/orders/:id` | ✅ | Retrieve order details. |
| `POST` | `/orders/:id/cancel` | ✅ | Cancel a pending order. |
| `GET` | `/orders/admin/all` | ✅ (staff) | Admin view of all orders (paginated). |
| `PATCH` | `/orders/:id/status` | ✅ (staff) | Update order status (e.g., `preparing`, `ready`). |

### Reservations
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/reservations` | ✅ | Create a reservation (guest or logged‑in). |
| `GET` | `/reservations` | ✅ | List user's reservations. |
| `GET` | `/reservations/:id` | ✅ | Get reservation details. |
| `PATCH` | `/reservations/:id/status` | ✅ (staff) | Update reservation status (e.g., `confirmed`). |
| `DELETE` | `/reservations/:id` | ✅ | Cancel reservation. |

### Users & Profile
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/users/me` | ✅ | Get own profile. |
| `PATCH` | `/users/me` | ✅ | Update profile (whitelisted fields). |
| `DELETE` | `/users/me` | ✅ | Delete (deactivate) own account. |
| `GET` | `/admin/users` | ✅ (admin) | List all users (admin panel). |

### Errors
All error responses follow the same envelope:
```json
{ "success": false, "data": null, "error": { "code": "ERR_VALIDATION", "message": "Invalid input", "details": { "field": "error description" } } }
```
Common error codes:
- `ERR_AUTHENTICATION` – missing/invalid JWT.
- `ERR_FORBIDDEN` – role insufficient.
- `ERR_NOT_FOUND` – resource does not exist.
- `ERR_VALIDATION` – Zod validation failed.
- `ERR_CONFLICT` – e.g., email already registered.
- `ERR_INTERNAL` – unexpected server error.

*All endpoints are versioned under `/api/v1/` to allow future upgrades without breaking clients.*

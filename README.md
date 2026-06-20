# FoodHub Backend API

FoodHub is a Multi-Vendor Food Ordering Platform where customers can browse meals, place orders, providers can manage meals and orders, and admins can manage the platform.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt
- CORS

---

## Features

### Authentication

- User Registration
- User Login
- JWT Access Token
- JWT Refresh Token
- Role Based Authorization

### Roles

- ADMIN
- PROVIDER
- CUSTOMER

### Category Management

- Create Category
- Get Categories
- Update Category
- Delete Category

### Meal Management

- Create Meal
- Update Meal
- Delete Meal
- Get Single Meal
- Get All Meals

### Search & Filter

- Search Meals
- Filter by Category
- Filter by Availability
- Filter by Price Range
- Pagination
- Sorting

### Cart Management

- Add To Cart
- Update Quantity
- Remove From Cart
- View Cart

### Order Management

#### Customer

- Place Order
- View My Orders
- View Single Order
- Cancel Order

#### Provider

- View Incoming Orders
- Update Order Status

#### Admin

- View All Orders

### Review System

- Create Review
- Update Meal Rating
- Prevent Duplicate Reviews

---

## Database Schema

### Main Models

- User
- ProviderProfile
- Category
- Meal
- Cart
- CartItem
- Order
- OrderItem
- Review

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create `.env`

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=30d

BCRYPT_SALT_ROUNDS=12

FRONTEND_URL=http://localhost:3000
```

---

## Prisma Setup

Generate Client

```bash
npx prisma generate
```

Run Migration

```bash
npx prisma migrate dev
```

---

## Seed Admin

```bash
npx prisma db seed
```

Default Admin

```txt
Email:
admin@foodhub.com

Password:
admin123
```

---

## Run Project

Development

```bash
npm run dev
```

Build

```bash
npm run build
```

Production

```bash
npm start
```

---

## API Base URL

```txt
http://localhost:5000/api
```

---

## Authentication Header

```http
Authorization: Bearer ACCESS_TOKEN
```

---

## Project Structure

```txt
src
├── app
│   ├── middleware
│   ├── module
│   │   ├── auth
│   │   ├── category
│   │   ├── meal
│   │   ├── cart
│   │   ├── order
│   │   └── review
│
├── config
├── helpers
├── lib
├── shared
└── server.ts
```

---

## Author

FoodHub Backend

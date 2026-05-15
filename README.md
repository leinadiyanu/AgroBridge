# AgroBridge Backend

> A hybrid agricultural platform backend connecting farmers, buyers, and administrators through web, USSD, and SMS channels.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](#license)

---

## What is AgroBridge?

AgroBridge bridges the gap between Nigerian farmers and buyers by supporting both digital and offline interactions. The platform handles product listings, order management, payments, and communication, with USSD and SMS support for users in low-connectivity environments.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT |
| Architecture | Modular Monolith |
| API Style | REST (v1) |

---

## Project Structure

```
AgroBridge/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── orders/
│   │   └── payments/
│   ├── config/
│   ├── middleware/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── dist/
├── package.json
├── tsconfig.json
└── .env
```

Each module follows a consistent internal structure: `routes`, `controller`, `service`, and `validators`, keeping business logic separated from HTTP handling.

---

## Features

- **Farmer onboarding** with product listing management
- **Buyer order placement** with tracking
- **JWT-based authentication** and role-based access control
- **USSD + SMS support** for offline and low-connectivity users
- **Modular architecture** designed for future microservice migration
- **Payment integration** (Paystack / Flutterwave, planned)
- **Order tracking** from placement to fulfillment

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- PostgreSQL 15+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/agrobridge.git
cd agrobridge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/agrobridge
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 4. Set Up the Database

Create the PostgreSQL database:

```bash
createdb agrobridge
```

Run Prisma migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the Development Server

```bash
npm run dev
```

The server starts at `http://localhost:5000`.

---

## Build for Production

```bash
npm run build
npm start
```

---

## API Reference

**Base URL:** `/api/v1`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List all products |
| POST | `/products` | Create a new listing (farmers only) |
| GET | `/products/:id` | Get a specific product |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders` | Place a new order |
| GET | `/orders/:id` | Get order details |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/profile` | Get authenticated user profile |

All protected routes require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## USSD / SMS Integration (Planned)

AgroBridge is being built with offline accessibility as a first-class concern:

- USSD menus for farmers without internet access
- SMS alerts for order confirmations and payment updates
- Multi-language support (English + local languages)

---

## Architecture Notes

AgroBridge uses a **Modular Monolith** pattern:

- Each feature domain (auth, products, orders, payments) is fully self-contained
- Shared database with clearly separated business logic per module
- Structured to migrate individual modules into microservices as traffic scales
- Common utilities and middleware kept outside modules to avoid duplication

This pattern keeps development velocity high while maintaining the flexibility to scale horizontally later.

---

## Roadmap

- [ ] Payment gateway integration (Paystack / Flutterwave)
- [ ] Real-time notifications via WebSockets
- [ ] Admin dashboard
- [ ] USSD / SMS channel (Africa's Talking integration)
- [ ] AI-based crop pricing suggestions
- [ ] Microservice extraction for high-load modules

---

## Author

**Daniel Akande**

**Ochulor Johnpaul**

**Ibeh Christogonous**

---

## License

This project is currently private. No license assigned.
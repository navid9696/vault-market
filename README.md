# ☢️ Vault Market

**Vault Market** is a Fallout-inspired e-commerce web application created as a technical and artistic showcase project. It simulates a retro-futuristic shopping terminal where users can register, log in, browse products, manage their cart, add favorites, place fictional orders, and exchange imaginary currency in a post-apocalyptic setting.

The application combines a distinct visual identity inspired by the Fallout universe with a structured e-commerce flow and a separate administrative panel for marketplace management.

> **Important:** Vault Market is a **fictional, non-commercial demo project**.  
> It does **not** process real payments, sell real products, or handle real financial transactions.  
> All items, prices, currencies, and orders are purely imaginary and are used only to demonstrate application structure, business logic, and UI/UX design.

---

## Preview

<img width="554" height="519" alt="image" src="https://github.com/user-attachments/assets/96157a70-671a-4852-8421-b72647bcb773" />

<img width="1167" height="758" alt="image" src="https://github.com/user-attachments/assets/8da5f1a5-21e4-4976-81a7-0aadd53d4d71" />

<img width="1349" height="841" alt="image" src="https://github.com/user-attachments/assets/52229297-4e4e-40d8-bdc1-1bff56fecf83" />

<img width="1352" height="835" alt="image" src="https://github.com/user-attachments/assets/0056702a-4e16-44dd-93fd-9da5d2f7b8ef" />

---

## Project Purpose

The main purpose of this project was to design and implement a coherent e-commerce-style system with a distinctive visual identity inspired by the Fallout universe.

The project focuses on:
- building a complete shopping flow,
- implementing authentication and authorization,
- separating user and admin functionality,
- integrating frontend and backend logic in a practical full-stack application,
- combining technical implementation with a strong, consistent UI/UX concept.

Vault Market should be treated as a **proof-of-concept application** and portfolio project rather than a production-ready online store.

---

## Features

### Authentication & Authorization
- User registration and login with email and password
- Google OAuth login
- Session handling with NextAuth
- Role-based access to user and admin areas

### User Functionality
- Browse products by category and subcategory
- View product details
- Add and remove items from cart
- Save products to favorites
- Place fictional orders with shipping details
- Manage account settings
- Update nickname, email, avatar, and password
- View order history
- Add product comments and ratings
- Use a fictional exchange system for **USD ↔ Bottle Caps**

### Admin Functionality
- Separate admin dashboard
- Product management
- User management
- Access to user orders and caps exchange records
- Product editing, availability, category, and discount management

### UI/UX
- Fallout-inspired terminal aesthetic
- Responsive layout
- Retro-styled notifications and feedback
- Distinct visual design across user and admin areas

---

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Frontend:** React 18
- **Styling:** Tailwind CSS, MUI v5, Bootstrap
- **API Layer:** tRPC
- **Authentication:** NextAuth.js
- **ORM:** Prisma
- **Database:** MongoDB
- **Validation:** Zod, React Hook Form
- **State Management:** Zustand
- **Notifications:** React Toastify
- **Image Handling:** Cloudinary
- **Charts / Data Visualization:** Recharts

---

## Project Structure

The application is divided into two main areas.

### User Side
The public-facing part of the application allows users to:
- browse the catalog,
- view product details,
- manage favorites and cart contents,
- place fictional orders,
- edit profile settings,
- review previous orders.

### Admin Side
A restricted panel intended for marketplace management allows the administrator to:
- manage products,
- manage users,
- inspect user orders,
- inspect bottle-cap exchange records,
- access marketplace overview pages.

This separation reflects a role-based architecture commonly used in modern web applications.

---

## Requirements

Before running the project locally, make sure you have:
- **Node.js** installed,
- **npm** installed,
- access to a **MongoDB** database,
- a configured **Google OAuth** application,
- a configured **Cloudinary** account.

---

## Installation

Clone the repository:

```bash
git clone <https://github.com/navid9696/vault-market>
cd vault-market
```

Install dependencies:

```bash
npm install
```

Fill in the required environment variables in the `.env` file.

Generate the Prisma client:

```bash
npx prisma generate
```

Push the Prisma schema to the database:

```bash
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## Environment Variables

To run the project locally, create a `.env` file in the root directory.

Example:

```env
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Variable Description

- `DATABASE_URL` – MongoDB connection string used by Prisma
- `GOOGLE_CLIENT_ID` – Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` – Google OAuth client secret
- `NEXTAUTH_SECRET` – secret used by NextAuth to sign sessions and tokens
- `NEXTAUTH_URL` – base URL of the application
- `CLOUDINARY_CLOUD_NAME` – Cloudinary cloud name
- `CLOUDINARY_API_KEY` – Cloudinary API key
- `CLOUDINARY_API_SECRET` – Cloudinary API secret



---

## Database

The project uses **MongoDB** with **Prisma** configured as the ORM layer.

The Prisma schema defines, among others, the following models:
- `User`
- `Products`
- `UserCart`
- `UserOrders`
- `OrderItem`
- `Favorite`
- `CapsOrder`
- `Comment`
- `Account`
- `Session`
- `VerificationToken`

If the database is empty, some application areas may require manual test data creation before the interface can be demonstrated properly.

---

## Admin Access

The application contains admin-only routes under `/admin`.

Based on the project logic, administrator access is associated with the following account:

```text
Email: admin@admin.admin
Password: Admin123!
```

---

## How to Use the Application

### Regular User Flow
1. Register a new account or sign in.
2. Browse products.
3. Open a product page.
4. Add products to the cart or favorites.
5. Proceed to checkout.
6. Submit a fictional order.
7. Review order history and manage account settings.

### Admin Flow
1. Sign in with the admin account.
2. Open the admin dashboard.
3. Manage products and users.
4. Review user orders and caps exchange entries.

---

## Scope and Limitations

Vault Market is a showcase project and has several intentional limitations:
- no real payment gateway integration,
- no real product sales,
- no real order fulfillment,
- no real financial transactions,
- fictional currency exchange logic,
- project intended for demonstration, educational, and portfolio purposes.

The application was designed to simulate the structure and experience of an e-commerce platform rather than function as a real commercial service.

---

## Contributing

Contributions, issues, and suggestions are welcome.

If you would like to improve the project:
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

---

## License

This project is distributed under the **MIT License**.

---

## Author

Created as an engineering and portfolio project focused on:
- full-stack web development,
- UI/UX design,
- role-based application structure,
- practical implementation of e-commerce logic in a fictional setting.

---

### ☢️ Vault-Tec Corporation ©
*"Prepare for the future, citizen."*

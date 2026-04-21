# ☢️ Vault Market

Full-stack e-commerce application with authentication, admin panel, and
realistic shopping flow --- built with Next.js, tRPC, Prisma, and
MongoDB.\
Inspired by Fallout aesthetics, but focused on production-like
architecture.

> Note: This is a demo project --- no real payments or transactions.

------------------------------------------------------------------------

## 🚀 Live Demo

👉 https://vault-market.vercel.app

Test account: - Email: test@test.test
- Password: Test123!

Admin account: - Email: admin@admin.admin
- Password: Admin123!

------------------------------------------------------------------------

## 🖼️ Application Overview

### Homepage
<img width="1878" height="1057" alt="Zrzut ekranu 2026-04-21 143533" src="https://github.com/user-attachments/assets/dde4d758-e933-4c16-974c-eede3ce6d023" />

### Product Listing & Filters
<img width="1876" height="990" alt="Zrzut ekranu 2026-04-21 143630" src="https://github.com/user-attachments/assets/94a58d32-9f9b-46c7-8f3e-2e43103ce5b0" />

### Product Details & Reviews
<img width="1511" height="892" alt="Zrzut ekranu 2026-04-21 143710" src="https://github.com/user-attachments/assets/2c4bbe4a-86d6-4be3-a706-f22b7484001e" />

### User Profile
<img width="420" height="603" alt="Zrzut ekranu 2026-04-21 143731" src="https://github.com/user-attachments/assets/db464784-0a5d-475a-af03-4b93c68be50a" />

### Admin Dashboard
<img width="1875" height="1035" alt="Zrzut ekranu 2026-04-21 143749" src="https://github.com/user-attachments/assets/b062c9d4-0fff-4f88-90cc-47c6995dd96f" />

### Admin Product Management
<img width="1871" height="1031" alt="Zrzut ekranu 2026-04-21 143811" src="https://github.com/user-attachments/assets/9ba3d818-1037-4f6a-bd05-38370a967801" />


------------------------------------------------------------------------

## ⚙️ Features

-   Secure authentication (email + Google OAuth)
-   Role-based access (user vs admin)
-   Full shopping flow (browse → cart → order)
-   Product reviews and ratings
-   Favorites system
-   Fictional currency exchange (USD ↔ Bottle Caps)
-   Admin dashboard for product & user management

------------------------------------------------------------------------

## 🧱 Tech Stack

**Frontend:** - Next.js 15 (App Router) - React 18 - Tailwind CSS + MUI

**Backend:** - tRPC (end-to-end typesafe API) - Prisma ORM - MongoDB

**Auth & Storage:** - NextAuth (OAuth + sessions) - Cloudinary (image
handling)

**State & Validation:** - Zustand - Zod - React Hook Form

------------------------------------------------------------------------

## 📚 What I Learned

-   Designing full-stack architecture with clear separation of concerns
-   Implementing role-based access control (RBAC)
-   Managing complex application state (cart, auth, admin flows)
-   Building scalable API with tRPC
-   Creating consistent UI/UX across user and admin panels

------------------------------------------------------------------------

## 🛠️ Installation

``` bash
git clone https://github.com/navid9696/vault-market
cd vault-market
npm install
```

Create `.env` file:

``` env
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run:

``` bash
npx prisma generate
npx prisma db push
npm run dev
```

App runs on:

    http://localhost:3000

------------------------------------------------------------------------

## 📦 Project Scope

This project simulates a real e-commerce platform but does not
include: - real payments - real transactions - real order fulfillment

It is intended as a portfolio project demonstrating full-stack
development skills.

------------------------------------------------------------------------

## 🤝 Contributing

Pull requests and suggestions are welcome.

------------------------------------------------------------------------

## 📄 License

MIT

------------------------------------------------------------------------

## 👤 Author

Project created as a portfolio piece focused on full-stack web
development and system design.

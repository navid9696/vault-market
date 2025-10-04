# ☢️ Vault Market

**Vault Market** is a full-featured Fallout-inspired e-commerce application.  
It simulates a post-apocalyptic Vault-Tec shopping terminal, where users can register, log in, browse products, manage their cart, exchange bottle caps for USD, and place orders — all in a retro-futuristic style.  
Admins can manage products, users, and monitor the marketplace with a separate dashboard.  

⚠️ **Important Note:**  
Vault Market is a **fictional, non-commercial project**.  
- No real money is involved — you don’t purchase items with actual currency.  
- Users simply enter the amount of fictional currency they want (USD or Bottle Caps).  
- All products, currency, and transactions are **purely imaginary**.  

This project is meant as an **artistic and technical showcase** of design, UI/UX, and development skills — not a real online store.  
<img width="554" height="519" alt="image" src="https://github.com/user-attachments/assets/96157a70-671a-4852-8421-b72647bcb773" />

<img width="1167" height="758" alt="image" src="https://github.com/user-attachments/assets/8da5f1a5-21e4-4976-81a7-0aadd53d4d71" />

<img width="1349" height="841" alt="image" src="https://github.com/user-attachments/assets/52229297-4e4e-40d8-bdc1-1bff56fecf83" />

<img width="1352" height="835" alt="image" src="https://github.com/user-attachments/assets/0056702a-4e16-44dd-93fd-9da5d2f7b8ef" />

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure login & registration with **NextAuth**
- Credential login with email & password
- OAuth with **Google**
- Role-based access:
  - **Citizen (User Panel)** – shopping experience
  - **Admin (Admin Panel)** – management tools

### 👤 User Panel
- Register & log in with Fallout-themed terminal feedback  
- Browse products with categories & subcategories  
- Add to cart, view total, and checkout  
- Manage profile: update nickname, email, avatar, password, or delete account  
- View order history and favorites  
- Exchange system: convert **USD ↔ Bottle Caps** at a fixed rate (fictional, user-input only)  

### 🛠️ Admin Panel
- Admin-only access via `admin@admin.admin`  
- Dashboard with quick overview  
- Manage products: create, edit, categories, discounts, availability  
- Manage users  
- Theme toggle: **Dark / Light**, saved in localStorage  

### 🎨 UI/UX
- Built with **Next.js 13**, **React**, and **TypeScript**  
- Styled using **MUI v5** + **TailwindCSS**  
- **react-hook-form + zod** for validation  
- **react-toastify** for retro Fallout-style notifications  
- Fully responsive & mobile-friendly design  

---

## 🛠️ Tech Stack

- **Framework:** Next.js 13 (App Router)  
- **Language:** TypeScript  
- **UI:** React, MUI v5, TailwindCSS  
- **API:** tRPC  
- **Auth:** NextAuth.js (credentials + Google OAuth)  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Validation:** zod + react-hook-form  
- **Notifications:** react-toastify  

---

## 🔑 Admin Access

By default, any user who logs in with:  
Email: admin@admin.admin  
Password: Admin123!  
will be recognized as **Admin** and gain access to `/admin/dashboard`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open a Pull Request or Issue.

---

## 📜 License

Distributed under the **MIT License**.

---

### ☢️ Vault-Tec Corporation ©  
*"Prepare for the future, citizen."*  

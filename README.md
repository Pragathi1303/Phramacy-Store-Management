# 💊 PharmaCare - Full Stack Pharmacy Store

A complete full-stack pharmacy web application built with React.js, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```
phramacy/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT protect + adminOnly middleware
│   │   └── upload.js        # Multer file upload config
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   └── Prescription.js
│   ├── routes/
│   │   ├── auth.js          # /api/auth
│   │   ├── products.js      # /api/products
│   │   ├── orders.js        # /api/orders
│   │   ├── cart.js          # /api/cart
│   │   └── prescriptions.js # /api/prescriptions
│   ├── uploads/             # Uploaded prescription files
│   ├── .env
│   ├── server.js
│   ├── seed.js              # Database seeder
│   └── package.json
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js
        ├── components/
        │   ├── Navbar.js
        │   └── ProductCard.js
        ├── pages/
        │   ├── Home.js
        │   ├── ProductDetail.js
        │   ├── Cart.js
        │   ├── Checkout.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Prescriptions.js
        │   ├── Orders.js
        │   └── AdminDashboard.js
        ├── utils/
        │   └── api.js
        ├── App.js
        └── index.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

### 1. Start MongoDB
Make sure MongoDB is running locally:
```bash
mongod
```
Or use MongoDB Atlas and update `MONGO_URI` in `backend/.env`.

---

### 2. Setup Backend
```bash
cd backend
npm install
npm run seed      # Seeds DB with sample products + admin/user accounts
npm run dev       # Starts backend on http://localhost:5000
```

---

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start         # Starts frontend on http://localhost:3000
```

---

## 🔐 Demo Accounts (after seeding)

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@pharmacy.com     | admin123  |
| User  | john@example.com       | user123   |

---

## 🌐 API Documentation

### Auth
| Method | Endpoint             | Description         | Auth |
|--------|----------------------|---------------------|------|
| POST   | /api/auth/register   | Register user       | No   |
| POST   | /api/auth/login      | Login               | No   |
| GET    | /api/auth/profile    | Get profile         | Yes  |
| PUT    | /api/auth/profile    | Update profile      | Yes  |

### Products
| Method | Endpoint             | Description         | Auth  |
|--------|----------------------|---------------------|-------|
| GET    | /api/products        | List (search/filter)| No    |
| GET    | /api/products/:id    | Get single product  | No    |
| POST   | /api/products        | Create product      | Admin |
| PUT    | /api/products/:id    | Update product      | Admin |
| DELETE | /api/products/:id    | Delete product      | Admin |

### Orders
| Method | Endpoint              | Description         | Auth  |
|--------|-----------------------|---------------------|-------|
| POST   | /api/orders           | Place order         | User  |
| GET    | /api/orders/my        | My orders           | User  |
| GET    | /api/orders           | All orders          | Admin |
| PUT    | /api/orders/:id/status| Update status       | Admin |

### Prescriptions
| Method | Endpoint                    | Description         | Auth  |
|--------|-----------------------------|---------------------|-------|
| POST   | /api/prescriptions          | Upload prescription | User  |
| GET    | /api/prescriptions/my       | My prescriptions    | User  |
| GET    | /api/prescriptions          | All prescriptions   | Admin |
| PUT    | /api/prescriptions/:id/status| Approve/Reject     | Admin |

### Cart
| Method | Endpoint   | Description   | Auth |
|--------|------------|---------------|------|
| GET    | /api/cart  | Get cart      | User |
| POST   | /api/cart  | Save cart     | User |
| DELETE | /api/cart  | Clear cart    | User |

---

## ✨ Features

- 🔐 JWT-based role authentication (user/admin)
- 🛒 Add to cart with quantity management
- 📋 Prescription upload (JPG/PNG/PDF, max 5MB)
- 📦 Order placement with stock management
- 🏥 Admin dashboard: manage products, orders, prescriptions
- 🔍 Search & filter medicines by name/category
- 📱 Responsive design
- 🔔 Toast notifications

---

## ☁️ Optional AWS Deployment

### EC2 (Backend)
```bash
# On EC2 instance
git clone <repo>
cd backend && npm install
pm2 start server.js
```

### S3 (Frontend)
```bash
cd frontend && npm run build
aws s3 sync build/ s3://your-bucket-name --acl public-read
```

# Book Store E-commerce MEAN Stack Project

![MEAN Stack](https://img.shields.io/badge/MEAN-Stack-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Last Commit](https://img.shields.io/badge/Last%20Updated-March%202025-brightgreen)

## 📖 Overview

A comprehensive Book Store E-commerce platform built using the MEAN Stack (MongoDB, Express.js, Angular, and Node.js) for ITI (Information Technology Institute). This application provides a seamless shopping experience for book enthusiasts with features for user authentication, product management, shopping cart functionality, and secure payment processing.

## ⚡ Features

- **User Authentication System**
- **Book Catalog Management**
- **Shopping Cart & Checkout Flow**
- **Order Processing & Tracking**
- **Admin Dashboard**
- **Responsive Design**
- **Payment Integration**
- **Search & Filter Functionality**

## 📂 Project Structure

```
book-store-ecommerce-mean/
├── apps/
│   ├── client/                 # Angular Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/
│   │   │   │   ├── models/
│   │   │   │   ├── services/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   └── app.module.ts
│   │   │   ├── assets/
│   │   │   ├── environments/
│   │   │   └── styles/
│   │   ├── angular.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── server/                 # Express Backend
│       ├── config/             # Configuration files
│       ├── controllers/        # Route controllers
│       ├── helpers/            # Helper functions
│       ├── middlewares/        # Custom middlewares
│       ├── models/             # MongoDB schema models
│       ├── routes/             # API routes
│       ├── services/           # Business logic
│       ├── validations/        # Request validation
│       ├── app.js              # Express app setup
│       ├── package.json
│       └── server.js           # Entry point
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Technology Stack

### Frontend

- **Angular**: v13+ with TypeScript
- **Angular Material**: UI component library
- **NgRx**: State management
- **RxJS**: Reactive programming
- **HTML5 & CSS3/SCSS**: Markup and styling
- **Bootstrap**: Responsive design framework

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing

### DevOps & Tools

- **Git & GitHub**: Version control
- **npm**: Package management
- **ESLint & Prettier**: Code quality
- **Jest & Jasmine**: Testing frameworks

## ⚙️ Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)
- Angular CLI (v13+)

### Installation and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ahmed-el-amine/book-store-ecommerce-mean.git
   cd book-store-ecommerce-mean
   ```

2. **Setup Backend**

   ```bash
   cd apps/server
   npm install
   ```

# Create a .env file with the following variables

    # PORT=
    # WEBSITE_NAME=
    # API_WEBSITE_URL_P=
    # API_WEBSITE_URL_D=
    # CLIENT_WEBSITE_URL_P=
    # CLIENT_WEBSITE_URL_D=
    # CORS_DOMAINS=
    # MONGODB_URI=
    # JWT_SEC_KEY=
    # JWT_EXPIRATION=
    # JWT_Cookie_Name=
    # EMAIL_SMTP_EMAIL=
    # EMAIL_SMTP_SERVER=
    # EMAIL_SMTP_PORT=
    # EMAIL_SMTP_USER=
    # EMAIL_SMTP_PASS=
    # CLOUDINARY_CLOUD_NAME=
    # CLOUDINARY_API_KEY=
    # CLOUDINARY_API_SECRET=

npm run dev

````

3. **Setup Frontend**

```bash
cd ../client
npm install
ng serve
````

4. **Access the Application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000/api

## 🖥️ Application Features

### Customer Features

- User registration and authentication
- Browse and search books by category, author, title
- View book details including reviews and ratings
- Add books to shopping cart
- Process secure checkout
- Track order status
- View order history
- Manage user profile

### Admin Features

- Comprehensive dashboard with analytics
- Manage book inventory (add, edit, remove)
- Manage categories and authors
- Process and track customer orders
- View and manage user accounts
- Generate sales reports

## 🧑‍💻 Contributors

- [Ahmed El Amine](https://github.com/ahmed-el-amine)
- [Ahmed Essam](https://github.com/AESharak)
- [Nada Emam](https://github.com/NadaEmamm)
- [Mustafa Ashraf](https://github.com/Mustafa-Ashraf751)
- [Fares Edres](https://github.com/FaresEdres)

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Information Technology Institute (ITI) for project requirements and guidance
- MEAN Stack community for excellent documentation and resources
- All contributors who have helped shape this project

---

Made with ❤️ by the Book Store Development Team

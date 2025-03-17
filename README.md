# Shopify Admin Dashboard

## Overview
This project is a **Shopify Admin Dashboard** built with **React, Redux, TailwindCSS, and Shopify Admin API**. It allows users to manage products dynamically, track real-time orders, and customize themes efficiently.

## Features Implemented
### ✅ Authentication
- Secure login system for authentication.
- Token-based authentication to access the Shopify API.

### ✅ Dynamic Product Management
- **Fetch products** from the Shopify store using the Admin API.
- **CRUD operations:** Add, edit, and delete products with API calls.
- **Form validation** implemented with **Formik & Yup**.
- **Bulk actions:** Select multiple products to delete/update.

### ✅ Search, Filtering & Sorting (Optimized Performance)
- **Debounced search:** Reduces unnecessary API calls.
- **Sorting:** Sorts products by price, rating, and stock.
- **Filtering:** Filters by category, stock availability, etc.
- **Pagination & Infinite Scrolling:** Ensures a smooth user experience.

### ✅ Dark Mode & Theme Customization
- **Dark/Light theme toggle** using CSS variables.
- **User preferences saved** in LocalStorage.

## Technologies Used
- **React.js** - Frontend framework
- **Redux Toolkit** - State management
- **TailwindCSS** - UI styling
- **Shopify Admin API** - Data management (REST API)
- **Formik & Yup** - Form validation
- **Lodash.debounce** - Optimized search
- **useCallback** - Performance optimizations

## Pending Features (In Progress)
### ⏳ Real-time Order Tracking
- Show live updates of orders using WebSockets.
- Fallback to polling every 5 seconds if WebSockets fail.
- Display order status updates dynamically.

## Setup & Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/MelvinYG/FrontEnd-Assignment-Videoit.git
   cd shopify-dashboard
   npm install
   cd ..
   cd dash-backend
   npm install
   ```
2. Set up Shopify API credentials in a `.env` file in both frontend and backend folders:
   ```sh
   REACT_APP_SHOPIFY_STORE_URL=your-shop-name.myshopify.com
   REACT_APP_SHOPIFY_ACCESS_TOKEN=your-access-token
   ```
3. Start the application:
    For front-end:
   ```sh
   npm run dev
   ```
   for backend:
   ```sh
   node server.js
   ```


## Future Improvements
- **Performance Enhancements**: Optimize API calls further.
- **Scalability**: Convert to a modular monorepo structure.
- **Role-Based Access Control**: Different permissions for users/admins.

## Access & Review
Given access to **design@videoit.io** to review the Shopify application.

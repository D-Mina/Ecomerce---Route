# FreshCart - Route E-Commerce Web Application (Next.js & TypeScript)

A modern, full-featured E-Commerce web application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**, fully integrated with the official **Route E-Commerce REST API** (`https://ecommerce.routemisr.com`).

---

## 🚀 Key Features & Implemented Requirements

### 1. 🔐 Complete Authentication & User Management
- **User Registration (`/register`)**: Full validation (Egyptian phone number pattern, password matching, min lengths) using `POST /api/v1/auth/signup`.
- **User Login (`/login`)**: Secure token storage in `localStorage`, decoding user information with `jwt-decode` using `POST /api/v1/auth/signin`.
- **Token Verification (`verifyToken`)**: Automatically verifies stored token validity against `GET /api/v1/auth/verifyToken`.
- **Forgot Password Flow (`/forgot-password`)**:
  - Request verification code via `POST /api/v1/auth/forgotPasswords`.
  - Verify 6-digit code via `POST /api/v1/auth/verifyResetCode` (`/verify-code`).
  - Set new password via `PUT /api/v1/auth/resetPassword` (`/reset-password`).
- **Profile & Security (`/profile`)**:
  - Update user name, email, and phone via `PUT /api/v1/users/updateMe/`.
  - Change password (current password, new password, confirm password) via `PUT /api/v1/users/changeMyPassword`.
- **Protected & Guest Routes**: Automatic redirects for authenticated/unauthenticated users.

### 2. 🏠 Interactive Homepage (`/`)
- **Main Hero Carousel (`MainSlider`)**: Multi-slide hero banner with auto-play, exclusive discounts, and static side promo cards.
- **Popular Categories Carousel (`CategorySlider`)**: Responsive swiper slider displaying top categories.
- **Feature Highlights Bar**: Free shipping, 14-day returns, 100% genuine products, and 24/7 support.
- **Featured Products Grid**: Live product cards with discount badges, ratings, quick add-to-cart, and instant wishlist toggles.
- **Popular Brands Showcase**: Brand cards linking directly to brand-filtered product listings.

### 3. 🛍️ Listing & Details Pages
- **Products Catalog (`/products`)**:
  - Live search keyword filter.
  - Category filter dropdown.
  - Brand filter dropdown.
  - Sorting (Price: High to Low, Price: Low to High, Top Rated, Alphabetical).
  - Clean pagination.
- **Product Details (`/products/[id]`)**:
  - Multi-image gallery with interactive thumbnail switcher.
  - Category & Brand badges.
  - Ratings & review counts (`ratingsAverage`, `ratingsQuantity`).
  - Pricing with discount strikethrough and savings counter.
  - Quantity selector stepper (`-`, `+`).
  - Add to Cart with loading indicators.
  - Wishlist toggle button.
  - **Full Reviews Section (`ReviewsSection`)**:
    - List existing customer reviews via `GET /api/v1/products/{id}/reviews`.
    - Submit a new review with interactive 5-star rating via `POST /api/v1/products/{id}/reviews`.
    - Edit existing review via `PUT /api/v1/reviews/{id}`.
    - Delete review via `DELETE /api/v1/reviews/{id}`.
  - Related products carousel/grid from the same category.
- **Categories Listing (`/categories`)**: Grid of all product categories with image hover animations.
- **Category Details (`/categories/[id]`)**: Category banner, subcategories list via `GET /api/v1/categories/{id}/subcategories`, and all products belonging to the category.
- **Brands Listing (`/brands`)**: Grid of all available brands with search.
- **Brand Details (`/brands/[id]`)**: Brand header, logo, and all products belonging to that brand.

### 4. 🛒 Complete Cart Operations (`/cart`)
- Display all cart items with images, title, unit price, quantity stepper, and subtotal.
- Add product to cart via `POST /api/v1/cart`.
- Update item quantity (`+` / `-`) via `PUT /api/v1/cart/{productId}`.
- Remove specific item from cart via `DELETE /api/v1/cart/{productId}`.
- Clear entire cart via `DELETE /api/v1/cart`.
- Apply coupon codes via `PUT /api/v2/cart/applyCoupon`.
- Live cart badge counter in the Navbar.

### 5. ❤️ Wishlist Operations (`/wishlist`)
- Display saved items in a clean grid.
- Add/remove items with instant optimistic UI feedback.
- Heart icon status synchronized across all views (Home, Products, Details, Wishlist).
- Quick transfer from Wishlist to Cart.

### 6. 💳 Payment & Checkout (`/checkout`)
- **Shipping Address Selection**:
  - Choose from saved addresses or enter custom details (Street, Phone, City, Postal Code).
- **Payment Methods**:
  - **Cash on Delivery**: Creates cash order via `POST /api/v1/orders/{cartId}` and redirects to Orders.
  - **Online Payment (Credit / Debit Card via Stripe)**: Creates checkout session via `POST /api/v1/orders/checkout-session/{cartId}?url={baseUrl}` and redirects directly to Stripe payment portal.

### 7. 📦 Orders History (`/allorders` & `/orders`)
- User order history via `GET /api/v1/orders/user/{userId}`.
- Order details breakdown: order ID, date, status badges (Cash/Card, Paid/Pending, Delivered/In Transit).
- Products summary with thumbnails, quantities, and total order cost.

### 8. 📍 Saved Addresses Management (`/addresses`)
- View saved addresses via `GET /api/v1/addresses`.
- Add new address via modal using `POST /api/v1/addresses`.
- Delete saved address via `DELETE /api/v1/addresses/{id}`.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Sliders/Carousels**: Swiper.js
- **JWT Decoding**: jwt-decode
- **Notifications**: React Hot Toast

---

## 🏃 Running the Application

### Development Server:
```bash
npm run dev
```
Open (https://ecomerceroute.vercel.app)](https://ecomerceroute.vercel.app)) in your browser.

### Production Build:
```bash
npm run build
npm start
```

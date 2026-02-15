# NextHome: Detailed Code Documentation

This document provides a deep dive into the architecture, logic, and implementation of the **NextHome** real estate platform.

---

## 1. Project Architecture & Configuration

### `package.json` & `tsconfig.json`
- **Next.js 16 (React 19)**: Leverages the latest React features and App Router.
- **Path Aliases**: `@/*` points to the project root, allowing clean imports like `import { dbConnect } from "@/lib/mongodb"`.
- **Dependencies**: Includes `mongoose` for DB, `firebase` for Auth/Storage, and `@reduxjs/toolkit` for state management.

### `middleware.ts`
- **Logic**: Intercepts requests to protected routes like `/profile` and `/create-listing`.
- **Implementation**: Checks for the `access_token` cookie. If missing, it redirects unauthenticated users to `/sign-in`. It also prevents authenticated users from accessing `/sign-in` or `/sign-up`.

---

## 2. Database & Models (`/models`, `/lib`)

### `lib/mongodb.ts`
- **Singleton Pattern**: Ensures only one database connection is created across the serverless environment, preventing "Too many connections" errors.

### `models/User.ts`
- **Fields**: `username`, `email` (unique), `password`, and `avatar`.
- **Timestamps**: Automatically tracks `createdAt` and `updatedAt`.

### `models/Listing.ts`
- **Fields**: Captures property details like `name`, `description`, `address`, `regularPrice`, `discountedPrice`, `bathrooms`, `bedrooms`, `furnished`, `parking`, `type` (rent/sell),
  - `offer`: Boolean
  - `imageURL`: String Array (Firebase Storage URLs)
  - `userRef`: String (User ID)

---

## 3. Backend Logic (API Routes: `/app/api`)

### Authentication (`/api/auth`)
- **Signup**: Hashes passwords using `bcryptjs` and saves new users.
- **Signin**: Validates credentials, generates a **JWT**, and sets it as an `httpOnly` cookie for security.
- **Google OAuth**: A hybrid approach. If the user doesn't exist, it creates one with a random password; then it signs them in with a JWT.
- **Signout**: Clears the `access_token` cookie.

### Listing Management (`/api/listings`)
- **GET (Search)**: A complex handler that supports filtering by `offer`, `type`, `parking`, `furnished`, and full-text `searchTerm`. It handles pagination via `startIndex`.
- **POST/DELETE**: Protected by JWT verification. Allows users to create or remove listings.

---

## 4. State Management (`/lib/redux`)

### `store.ts` & `userSlice.ts`
- **State**: Tracks `currentUser`, `loading` status, and `error` messages.
- **Persistence**: Uses `redux-persist` with local storage to keep users logged in even after refreshing the page.
- **Provider**: `ReduxProvider.tsx` wraps the entire application to provide the store to both Server and Client components.

---

## 5. Frontend & UI (`/components`, `/app`)

### `app/layout.tsx` (The Root)
- Defines the global structure. Wraps everything in `ReduxProvider` and includes the shared `Header`.
- Sets global SEO metadata.

### `app/page.tsx` (Homepage)
- **SSR Logic**: Directly calls `Listing.find()` inside the server component for "Recent Offers", "Rental", and "Sale" listings.
- **UI**: Uses a hero section with `HomeSwiper` (carousel) and `ListingItem` cards.

### `app/search/page.tsx`
- **Client-Side Interactivity**: Uses `useSearchParams` to sync the UI filters (sidebar) with the URL.
- **Dynamic Fetching**: Triggers a new API call whenever the search parameters change.

### `app/listing/[id]/page.tsx`
- **Dynamic Routing**: Fetches a single listing by ID on the server.
- **Client Features**: Uses `ClientListingWrapper` to handle image carousels and the "Share" functionality (copying URL to clipboard).

### `components/Header.tsx`
- **Logic**: Dynamic navigation. Shows "Sign In" if logged out, or the user's avatar if logged in. Includes the global search bar.
- **Style**: Custom hex color `#F6F5F2` for a premium feel.

---

## 6. Integration Services

### Firebase (`lib/firebase.ts`)
- **Auth**: Powers the Google Sign-in flow.
- **Storage**: Used in `create-listing` and `profile` to host property and profile images reliably.

---

## 7. Global Styles (`app/globals.css`)
- **Tailwind CSS**: Managed the entire UI through utility classes.
- **Customizations**: Custom scrollbars, fade-in animations, and the global background color `#F8E8EE`.

# AI Story Generator - Next Level Architecture Plan

This architecture plan outlines the necessary upgrades required to implement user authentication, a points-based leaderboards system, user story histories, and a creative home page layout. 

## 1. Database & Schemas to be Added

To support users and their interactions, we'll need to update the relational database schema in the FastAPI backend:

**New Database Models**
*   **`User` Model:**
    *   `id` (UUID or Integer, Primary Key)
    *   `username` (String, Unique, Indexed)
    *   `email` (String, Unique, Indexed)
    *   `hashed_password` (String)
    *   `points` (Integer, default=0)
    *   `created_at` (DateTime, default=UTC Now)
    *   `stories` (Relationship to `Story` model)

**Updated Database Models**
*   **`Story` Model:**
    *   Requires a `user_id` (Foreign Key referencing `User.id`), making stories traceable to specific individuals.

**Pydantic Schemas (`backend/schemas/`)**
*   `UserCreate`: Validates registration input (`username`, `email`, `password`).
*   `UserResponse`: Returns public user info (`id`, `username`, `points`).
*   `Token` & `TokenData`: Used for JWT verification.
*   `StoryResponse`: Updated to include basic author info.

## 2. Packages to be Added

### Backend (Python/FastAPI)
*   **`passlib[bcrypt]`**: To hash and verify user passwords securely.
*   **`PyJWT`** or **`python-jose[cryptography]`**: To generate and sign JWT (JSON Web Tokens) for stateless sessions.
*   **`python-multipart`**: Enables FastAPI to parse OAuth2 form data (used for standard login forms).

### Frontend (React/Vite)
*   **`zustand`** (or React Context API): Simplified and fast global state management for tracking the current logged-in user state.
*   **`framer-motion`**: For crafting a fluid, "creative" home page with beautiful entrance animations for the leaderboard displaying the Top 3 / Top 10 users.
*   **`lucide-react`**: For consistent, aesthetic icons across the profile and leaderboard views.

## 3. Files to be Added/Edited

### Backend Changes
*   📝 **Add `backend/models/user.py`**: Defines the SQLAlchemy `User` table.
*   📝 **Add `backend/schemas/user.py` & `backend/schemas/token.py`**: Pydantic validation structures.
*   📝 **Add `backend/core/security.py`**: Helper functions for `verify_password`, `get_password_hash`, and `create_access_token`.
*   📝 **Add `backend/core/dependencies.py`**: Contains the `get_current_user` injected dependency to protect API routes.
*   📝 **Add `backend/routers/auth.py`**: Endpoints for `/register`, `/login` (Token generation), and `/me`.
*   📝 **Add `backend/routers/leaderboard.py`**: Endpoint to fetch the top 3 and top 10 users ordered by points.
*   🛠️ **Edit `backend/models/story.py`**: Add the `user_id` relationship property.
*   🛠️ **Edit `backend/routers/story.py`**:
    *   Inject `current_user: User = Depends(get_current_user)`.
    *   Assign `user_id` when saving the story.
    *   **Points Calculation:** Add logic here to perform `current_user.points += <amount>` upon a successfully generated story.
    *   Add a `GET /stories/me` endpoint to fetch the user's history.
*   🛠️ **Edit `backend/main.py`**: Include the new routers (`auth`, `leaderboard`).
*   🛠️ **Edit `backend/alembic/versions/...`**: Auto-generate a new migration script to update the PostgreSQL schema with users and logic.

### Frontend Changes
*   📝 **Add `frontend/src/store/useAuthStore.js`**: Global store holding the active JWT token and user details `{ id, username, points }`.
*   📝 **Add `frontend/src/api/axiosClient.js`**: Setup an Axios interceptor to automatically attach `Authorization: Bearer <token>` to requests.
*   📝 **Add `frontend/src/pages/Login.jsx` & `frontend/src/pages/Register.jsx`**: Authentication pages.
*   📝 **Add `frontend/src/pages/Profile.jsx`**: Displays user info, point tally, and a feed mapping over their past story generations (similar to a chat history pane).
*   📝 **Add `frontend/src/pages/Home.jsx`**: The new "Creative Home Page". 
    *   Includes animated podium components for the Top 3 users.
    *   Includes a visually distinct list component for the Top 10 users.
*   🛠️ **Edit `frontend/src/App.jsx`**: Integrate React Router with Protected Routes logic (redirect unauthenticated users trying to generate a story away to `/login`).
*   🛠️ **Edit `frontend/src/components/Navbar.jsx`**: Show dynamic links for "Login / Sign up" or "Profile (Points) / Logout" depending on active auth state.

## 4. Approach & Implementation Strategy

1.  **Database Migration**:
    *   Define the `User` model, modify `Story` to link to it. Run an Alembic migration so the database is updated without data loss.

2.  **Authentication Layer (Backend)**:
    *   Spin up OAuth2 Password Bearer implementation natively supported by FastAPI. Ensure token generation correctly embeds the `sub` (user email/ID).
    *   Build the `get_current_user` dependency guard so routes can be arbitrarily protected.

3.  **Core Feature Logic (Backend)**:
    *   Modify the `/generate` endpoints to assign points and link `user_id`. Add a `GET` `/leaderboard` endpoint fetching `User.query.order_by(desc(User.points)).limit(10)`.

4.  **Frontend State & Interceptors**:
    *   Bring in Zustand + Axios interceptor. On reload, the frontend should check `localStorage` for a token and fetch `/users/me` to hydrate the user state.

5.  **Page Construction (Frontend)**:
    *   Build the Auth screens.
    *   Build out the **Profile History**: Fetch `/stories/me` and map them elegantly inside cards or list items.
    *   Build out the **Creative Home Page**: Query the leaderboard API on mount, use framer-motion to orchestrate a staggered layout of user ranks.

6.  **Polishing**:
    *   Apply proper CSS/Tailwind rules for dark modes and glassmorphism (following modern UI aesthetics), ensuring the new dashboards look unified and premium.

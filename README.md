# RideShare - Advanced Full-Stack Transportation Platform

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19.1.1-blue)

**RideShare** is a production-grade, full-stack ride-hailing application engineered to demonstrate advanced web development concepts. It features real-time socket communication, complex state management, geospatial routing, and a secure authentication system.

This project was built to showcase a scalable architecture capable of handling real-world scenarios like driver-rider matching, live location tracking, and dynamic pricing.

---

## 🚀 Tech Stack & Engineering

### Frontend (Client-Side)
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4 (Utility-first, responsive design)
- **State Management**: React Context API (User, Captain, Socket)
- **Maps & Routing**: 
  - `react-leaflet`: For interactive map rendering.
  - `leaflet`: Core mapping library.
  - **OSRM (Open Source Routing Machine)**: For calculating precise polylines and routes between coordinates.
- **Real-time**: `socket.io-client` for bi-directional event-based communication.

### Backend (Server-Side)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM) with Geospatial Indexing (for location-based queries).
- **Authentication**: JWT (JSON Web Tokens) & bcrypt for password hashing.
- **Real-time**: `socket.io` for handling WebSocket connections.
- **Validation**: `express-validator` for robust input sanitization.

---

## ✨ Key Features

- **🔐 Dual Authentication System**: Separate login/signup flows for Users and Captains (Drivers) with secure token management.
- **🗺️ Real-Time Location Tracking**: Live updates of driver positions on the map using WebSocket events.
- **📍 Smart Routing (Polyline)**: 
  - Visualizes the exact path from pickup to destination.
  - Calculates accurate distance and ETA using OSRM API.
- **💸 Fare Estimation**: Algorithmic price calculation based on distance and vehicle type (Car, Auto, Motorcycle).
- **🔄 Ride Lifecycle Management**: Complete state machine implementation (Requested → Accepted → In Progress → Completed).
- **📱 Responsive UI**: Mobile-first design ensuring a seamless experience across devices.

---

## 📑 Table of Contents
- [Tech Stack](#-tech-stack--engineering)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture--concepts)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Detailed API Reference](#-detailed-api-reference)
- [Setup & Installation](#-setup--installation)

---

## 📂 Project Structure

```bash
RideShare/
├── backend/                 # Node.js/Express Server
│   ├── controllers/         # Logic for Users, Captains, Rides, Maps
│   ├── db/                  # Database connection logic
│   ├── middlewares/         # Auth and Validation middlewares
│   ├── models/              # Mongoose Schemas (User, Captain, Ride, BlacklistToken)
│   ├── routes/              # API Route definitions
│   ├── services/            # Business logic helper services
│   ├── server.js            # Entry point
│   └── app.js               # Express app setup
│
├── frontend/                # React (Vite) Client
│   ├── src/
│   │   ├── Components/      # Reusable UI components
│   │   ├── context/         # State management (User, Captain, Socket)
│   │   ├── pages/           # Application views/routes
│   │   ├── main.jsx         # Entry point
│   │   └── App.jsx          # Route configuration
│   ├── index.css            # Tailwind global styles
│   └── package.json         # Dependencies
│
└── README.md                # Project Documentation
```

---

## 🛠️ System Architecture & Concepts

### 1. Ride State Management (Lifecycle)
The core of the application relies on a robust state machine that governs the ride lifecycle. This state is managed across the Database, Backend RAM, and Frontend Contexts.

#### The "Ride" State Machine:
*   **`requested`**: 
    *   **Trigger**: User confirms a ride.
    *   **Action**: A ride record is created in MongoDB. The server emits a `new-ride` socket event to all captains within radius.
    *   **UI**: User sees "Looking for Driver". Captains get a popup notification.
    *   **State Persistence**: MongoDB stores the ride with status `requested`.
*   **`accepted`**:
    *   **Trigger**: A Captain accepts the ride request.
    *   **Action**: Server updates ride status to `accepted` and emits `ride-accepted` to the specific user.
    *   **UI**: User sees Driver details and ETA. Captain navigates to pickup.
*   **`in_progress`**:
    *   **Trigger**: Captain enters the OTP provided by the user.
    *   **Action**: Server validates OTP, updates status to `in_progress`, and emits `ride-started`.
    *   **UI**: Both screens switch to the "Riding" view/Map tracking mode.
*   **`completed`**:
    *   **Trigger**: Captain reaches destination and ends trip.
    *   **Action**: Server calculates final fare, updates status to `completed`, and emits `ride-ended`.
    *   **UI**: Payment modal appears.

#### Frontend State Synchronization
- **Context API (`UserContext`, `CaptainContext`)**: Holds static auth data.
- **Socket Context**: Listens for real-time events (`ride-confirmed`, `ride-started`) to trigger UI transitions without page reloads.

### 2. Polyline & Mapping Strategy
Drawing the route on the map involves:
1.  **Coordinate Extraction**: Pickup and Destination addresses are geocoded into `[lat, lng]`.
2.  **Route Calculation**: The app queries the **OSRM** (Open Source Routing Machine) API to get the geometry of the road network between points.
3.  **Rendering**: The geometry is decoded into an array of coordinates and rendered as a `<Polyline />` component using `react-leaflet`.
4.  **Auto-Recenter**: The map view dynamically adjusts bounds to keep both pickup and drop-off points visible.

---

## 🔌 API Documentation

### Base URL: `http://localhost:4000`

### User Routes (`/users`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Create a new user account. |
| `POST` | `/login` | Authenticate user and receive JWT. |
| `GET` | `/profile` | Get current user details (Secured). |
| `GET` | `/logout` | Invalidate session. |

### Captain Routes (`/captains`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register a new driver (requires vehicle details). |
| `POST` | `/login` | Authenticate captain. |
| `GET` | `/profile` | Get captain profile (Secured). |
| `GET` | `/logout` | Invalidate session. |

### Maps Routes (`/maps`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/get-coordinates` | Convert address string to `[lat, lng]`. |
| `GET` | `/get-distance-time` | Get matrix data for origin-destination pairs. |
| `GET` | `/get-suggestions` | Autocomplete API for location search. |

### Ride Routes (`/rides`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/create` | Request a new ride. |
| `GET` | `/fare-estimate` | Get price for all vehicle types. |
| `POST` | `/accept-ride` | Captain accepts a request. |
| `GET` | `/start-ride` | Start trip (requires OTP). |
| `GET` | `/end-ride` | Complete trip. |

---

## 📖 Detailed API Reference

### POST /users/register

#### Description

Registers a new user in the system. The endpoint validates the provided user information, hashes the password using bcrypt, creates a user record in the database, and returns an authentication token along with the user details.

#### Request Method

`POST`

#### Request URL

```
http://localhost:[PORT]/users/register
```

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

The request body should be sent as JSON with the following structure:

```json
{
  "fullName": {
    "firstName": "string (required, minimum 3 characters)",
    "lastName": "string (optional, minimum 3 characters if provided)"
  },
  "email": "string (required, must be valid email format)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Example Request

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Validation Rules

- **email**: Must be a valid email address format
- **fullName.firstName**: Must be at least 3 characters long
- **fullName.lastName**: Optional, but if provided must be at least 3 characters long
- **password**: Must be at least 6 characters long
- **All fields are required** (except lastName)

#### Response Status Codes

| Status Code | Description                                                             |
| ----------- | ----------------------------------------------------------------------- |
| **201**     | User successfully created. Returns authentication token and user object |
| **400**     | Validation error. Missing or invalid fields in request body             |
| **500**     | Server error during user creation                                       |

#### Success Response (201 Created)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "ab",
      "msg": "First name must be atleast three chars long",
      "path": "fullName.firstName",
      "location": "body"
    }
  ]
}
```

#### Notes

- Passwords are hashed using bcrypt before being stored in the database
- The authentication token is generated using JWT (JSON Web Token)
- The returned token can be used for subsequent authenticated requests
- Email addresses must be unique in the database

---

### POST /users/login

#### Description

Authenticates a user by verifying their email and password. If credentials are valid, the endpoint returns an authentication token and user details. This token can be used for subsequent authenticated requests.

#### Request Method

`POST`

#### Request URL

```
http://localhost:[PORT]/user/login
```

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

The request body should be sent as JSON with the following structure:

```json
{
  "email": "string (required, must be valid email format)",
  "password": "string (required)"
}
```

#### Example Request

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Validation Rules

- **email**: Must be a valid email address format
- **password**: Must be provided
- **Both fields are required**

#### Response Status Codes

| Status Code | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| **200**     | Login successful. Returns authentication token and user object |
| **400**     | Validation error. Missing or invalid fields in request body    |
| **401**     | Unauthorized. Invalid email or password                        |
| **500**     | Server error during login                                      |

#### Success Response (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Invalid email format",
      "path": "email",
      "location": "body"
    }
  ]
}
```

#### Error Response (401 Unauthorized)

```json
{
  "message": "Invalid email or password"
}
```

#### Notes

- Passwords are compared using bcrypt's compare method for security
- The authentication token is generated using JWT (JSON Web Token)
- The returned token can be used for subsequent authenticated requests
- If either email or password is incorrect, a generic message is returned for security reasons (no indication of which field is wrong)
- The password field is not returned in the user object for security purposes

---

### GET /users/profile

#### Description

Retrieves the authenticated user's profile information. This is a protected endpoint that requires a valid authentication token. The endpoint returns the complete user object for the authenticated user.

#### Request Method

`GET`

#### Request URL

```
http://localhost:[PORT]/user/profile
```

#### Request Headers

```
Authorization: Bearer <token>
```

or

```
Cookie: token=<token>
```

#### Authentication

**Required**: Yes

- This endpoint requires a valid JWT authentication token obtained from either the `/users/register` or `/user/login` endpoints
- Token can be passed via:
  - Authorization header with Bearer scheme
  - Cookie named "token"

#### Request Body

No request body required.

#### Response Status Codes

| Status Code | Description                                                               |
| ----------- | ------------------------------------------------------------------------- |
| **200**     | Profile retrieved successfully. Returns authenticated user's profile data |
| **401**     | Unauthorized. Missing or invalid authentication token                     |
| **500**     | Server error during profile retrieval                                     |

#### Success Response (200 OK)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "socketId": null
}
```

#### Error Response (401 Unauthorized)

```json
{
  "message": "Unauthorized"
}
```

#### Example cURL Request

```bash
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

or with cookie:

```bash
curl -X GET http://localhost:3000/user/profile \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Notes

- This endpoint requires authentication middleware (`authMiddleware.authUser`)
- The token is validated to ensure the user is authenticated
- Only the authenticated user can access their own profile
- The password field is not included in the response for security purposes
- This endpoint is useful for retrieving current user information after login

---

### GET /users/logout

#### Description

Logs out the authenticated user by invalidating their authentication token. The endpoint clears the token cookie and adds the token to a blacklist, preventing it from being used for future authenticated requests. This is a protected endpoint that requires a valid authentication token.

#### Request Method

`GET`

#### Request URL

```
http://localhost:[PORT]/users/logout
```

#### Request Headers

```
Authorization: Bearer <token>
```

or

```
Cookie: token=<token>
```

#### Authentication

**Required**: Yes

- This endpoint requires a valid JWT authentication token obtained from either the `/users/register` or `/user/login` endpoints
- Token can be passed via:
  - Authorization header with Bearer scheme
  - Cookie named "token"

#### Request Body

No request body required.

#### Response Status Codes

| Status Code | Description                                           |
| ----------- | ----------------------------------------------------- |
| **200**     | Logout successful. Token has been blacklisted         |
| **401**     | Unauthorized. Missing or invalid authentication token |
| **500**     | Server error during logout                            |

#### Success Response (200 OK)

```json
{
  "message": "Logged out"
}
```

#### Error Response (401 Unauthorized)

```json
{
  "message": "Unauthorized"
}
```

#### Example cURL Request

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

or with cookie:

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Notes

- This endpoint requires authentication middleware (`authMiddleware.authUser`)
- The token is cleared from cookies and added to a blacklist
- After logout, the token cannot be used for future requests even if stored locally
- The blacklist prevents token reuse attacks
- Users should delete the stored token on the client side for security
- This endpoint invalidates the current session immediately

---

### POST /captains/register

#### Description

Registers a new captain in the system. The endpoint validates the provided captain information, hashes the password using bcrypt, creates a captain record in the database, and returns an authentication token along with the captain details.

#### Request Method

`POST`

#### Request URL

```
http://localhost:[PORT]/captains/register
```

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

The request body should be sent as JSON with the following structure:

```json
{
  "fullName": {
    "firstName": "string (required, minimum 3 characters)",
    "lastName": "string (optional, minimum 3 characters if provided)"
  },
  "email": "string (required, must be valid email format)",
  "password": "string (required, minimum 6 characters)",
  "vehicle": {
    "color": "string (required, minimum 3 characters)",
    "plate": "string (required, minimum 3 characters)",
    "capacity": "number (required, between 2-20)",
    "vehicleType": "string (required, one of: car, motorcycle, auto)"
  }
}
```

#### Example Request

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.captain@example.com",
  "password": "securePassword123",
  "vehicle": {
    "color": "Black",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Validation Rules

- **email**: Must be a valid email address format and unique in the system
- **fullName.firstName**: Minimum 3 characters required
- **fullName.lastName**: Minimum 3 characters if provided
- **password**: Minimum 6 characters required
- **vehicle.color**: Minimum 3 characters required
- **vehicle.plate**: Minimum 3 characters required
- **vehicle.capacity**: Integer between 2-20 required
- **vehicle.vehicleType**: Must be one of: `car`, `motorcycle`, `auto`

#### Response Status Codes

| Status Code | Description                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| **201**     | Captain successfully created. Returns authentication token and captain object |
| **400**     | Validation error. Missing or invalid fields in request body                   |
| **401**     | Email already registered                                                      |
| **500**     | Server error during captain creation                                          |

#### Success Response (201 Created)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.captain@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive",
    "socketId": null,
    "location": {
      "lat": null,
      "lng": null
    }
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "1",
      "msg": "Capacity between 2 - 20",
      "path": "vehicle.capacity",
      "location": "body"
    }
  ]
}
```

#### Error Response (401 Unauthorized)

```json
{
  "message": "Email already registered"
}
```

#### Example cURL Request

```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.captain@example.com",
    "password": "securePassword123",
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

#### Notes

- Passwords are hashed using bcrypt before being stored in the database (salt rounds: 10)
- The authentication token is generated using JWT (JSON Web Token)
- The returned token can be used for subsequent authenticated requests
- Email addresses must be unique in the database
- Default captain status is "inactive" upon registration
- Socket ID is null until captain goes online
- JWT token expires in 24 hours

---

### POST /captains/login

#### Description

Authenticates a captain by verifying their email and password. If credentials are valid, the endpoint returns an authentication token and captain details. This token can be used for subsequent authenticated requests.

#### Request Method

`POST`

#### Request URL

```
http://localhost:[PORT]/captains/login
```

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

The request body should be sent as JSON with the following structure:

```json
{
  "email": "string (required, must be valid email format)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Example Request

```json
{
  "email": "captain@example.com",
  "password": "securePassword123"
}
```

#### Validation Rules

- **email**: Must be a valid email address format
- **password**: Minimum 6 characters required

#### Response Status Codes

| Status Code | Description                                                       |
| ----------- | ----------------------------------------------------------------- |
| **200**     | Login successful. Returns authentication token and captain object |
| **400**     | Validation error. Missing or invalid fields in request body       |
| **401**     | Unauthorized. Invalid email or password                           |
| **500**     | Server error during login                                         |

#### Success Response (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Rider"
    },
    "email": "captain@example.com",
    "vehicle": {
      "color": "Blue",
      "plate": "XYZ789",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "active",
    "socketId": null,
    "location": {
      "lat": null,
      "lng": null
    }
  }
}
```

---

### GET /captains/profile

#### Description

Retrieves the authenticated captain's profile information. This is a protected endpoint that requires a valid authentication token. The endpoint returns the captain object for the authenticated captain.

#### Request Method

`GET`

#### Request URL

```
http://localhost:[PORT]/captains/profile
```

#### Request Headers

```
Authorization: Bearer <token>
```

or

```
Cookie: token=<token>
```

#### Authentication

**Required**: Yes

- This endpoint requires a valid JWT authentication token obtained from `/captains/register` or `/captains/login`
- Token can be passed via Authorization header (Bearer) or a `token` cookie

#### Request Body

No request body required.

#### Response Status Codes

| Status Code | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------- |
| **200**     | Profile retrieved successfully. Returns authenticated captain's profile data |
| **401**     | Unauthorized. Missing or invalid authentication token                        |
| **500**     | Server error during profile retrieval                                        |

#### Success Response (200 OK)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": {
    "firstName": "Jane",
    "lastName": "Rider"
  },
  "email": "captain@example.com",
  "vehicle": {
    "color": "Blue",
    "plate": "XYZ789",
    "capacity": 4,
    "vehicleType": "car"
  },
  "status": "active",
  "socketId": null,
  "location": { "lat": null, "lng": null }
}
```

---

### GET /captains/logout

#### Description

Logs out the authenticated captain by invalidating their authentication token. The endpoint clears the token cookie and adds the token to a blacklist, preventing it from being used for future authenticated requests. This is a protected endpoint that requires a valid authentication token.

#### Request Method

`GET`

#### Request URL

```
http://localhost:[PORT]/captains/logout
```

#### Request Headers

```
Authorization: Bearer <token>
```

or

```
Cookie: token=<token>
```

#### Authentication

**Required**: Yes

- This endpoint requires a valid JWT authentication token obtained from `/captains/register` or `/captains/login`
- Token can be passed via Authorization header (Bearer) or a `token` cookie

#### Response Status Codes

| Status Code | Description                                           |
| ----------- | ----------------------------------------------------- |
| **200**     | Logout successful. Token has been blacklisted         |
| **401**     | Unauthorized. Missing or invalid authentication token |
| **500**     | Server error during logout                            |

#### Success Response (200 OK)

```json
{
  "message": "Logged out"
}
```

#### Notes

- These captain endpoints use `auth.middleware.js` (`authCaptain`) for protected routes
- Blacklisting uses the `blacklistToken` model to prevent token reuse
- Store tokens securely on the client side and remove them on logout
- JWT token expires in 24 hours

---

### GET /users/get-nearby-captains

#### Description

Fetches captains within a specific radius of the user's location.

#### Request Method

`GET`

#### Query Parameters

- `lat`: User's latitude (required)
- `lng`: User's longitude (required)

#### Response

Returns an array of captain objects including their vehicle info and coordinates.

---

### Map Routes

All map routes are protected (require a valid JWT via Authorization: Bearer <token> or cookie `token`). Validation is performed using express-validator.

- **GET /map/get-coordinates**
  - Query: `address` (string, min length 3) — required
  - Description: Returns coordinates (lat/lng) for the provided address.
  - Success: 200 with coordinates JSON
  - Errors: 400 for validation, 401 for unauthorized, 500 for server errors
  - Example:
    ```bash
    curl -G http://localhost:3000/map/get-coordinates \
      --data-urlencode "address=1600 Amphitheatre Parkway, Mountain View, CA" \
      -H "Authorization: Bearer <token>"
    ```

- **GET /map/get-distance-time**
  - Query: `origins` (string, min length 3) — required
  - Query: `destinations` (string, min length 3) — required
  - Description: Returns distance and duration estimates between origins and destinations.
  - Success: 200 with distance/time data
  - Errors: 400 for validation, 401 for unauthorized, 500 for server errors
  - Example:
    ```bash
    curl -G http://localhost:3000/map/get-distance-time \
      --data-urlencode "origins=Origin Address" \
      --data-urlencode "destinations=Destination Address" \
      -H "Authorization: Bearer <token>"
    ```

- **GET /map/get-suggestions**
  - Query: `input` (string, min length 1) — required
  - Description: Returns address suggestions/autocomplete for the input string.
  - Success: 200 with suggestions array
  - Errors: 400 for validation, 401 for unauthorized, 500 for server errors
  - Example:
    ```bash
    curl -G http://localhost:3000/map/get-suggestions \
      --data-urlencode "input=Times Sq" \
      -H "Authorization: Bearer <token>"
    ```

---

### Ride Routes

All ride routes are protected (require a valid JWT via Authorization: Bearer <token> or cookie `token`). Validation is performed using express-validator.

- **POST /rides/create**
  - Body: `origin`, `destination`, `vehicleType`
  - Description: Create a new ride request.

- **GET /rides/fare-estimate**
  - Query: `origin`, `destination`
  - Description: Get fare estimates for all vehicle types.

- **POST /rides/accept-ride** (Captain Only)
  - Body: `rideId`
  - Description: Captain accepts a requested ride.

- **GET /rides/start-ride** (Captain Only)
  - Query: `rideId`, `OTP`
  - Description: Start the ride after verifying OTP.

- **GET /rides/end-ride** (Captain Only)
  - Query: `rideId`
  - Description: Complete the ride.

- **POST /rides/update-user-location**
  - Body: `rideId`, `latitude`, `longitude`
  - Description: Update user's live location during a ride.

- **POST /rides/update-captain-location** (Captain Only)
  - Body: `rideId`, `latitude`, `longitude`
  - Description: Update captain's live location during a ride.

- **GET /rides/ride-status/user**
  - Query: `rideId`
  - Description: Get current status of a specific ride.

- **GET /rides/active-ride/user**
  - Description: Get the currently active ride for the logged-in user (if any).

- **GET /rides/active-ride/captain** (Captain Only)
  - Description: Get the currently active ride for the logged-in captain.

- **POST /rides/cancel**
  - Body: `rideId`
  - Description: Cancel a requested ride.

---

*“Code is like humor. When you have to explain it, it’s bad.” – Cory House* 
*(But good documentation makes sure you don't have to explain it twice!)* 😉
```

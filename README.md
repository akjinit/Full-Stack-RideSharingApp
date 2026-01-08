# Uber-Like Ride Sharing Prototype

## Project Overview

This project is a full-stack ride-sharing backend inspired by Uber architecture. It provides:

* Separate authentication for **users** and **captains (drivers)**
* Real-time ride acceptance using **Socket.IO**
* Geospatial queries in **MongoDB / Mongoose**
* Input validation with **express-validator**
* Map services for coordinates, distance-time, and location suggestions.

---

## Backend Architecture

The server follows a modular structure:

```
root
├── controllers
├── middlewares
├── models
├── routes
├── services
└── app.js / server.js
```

### Core Modules

#### 1. Authentication Middleware

* `authUser` – protects user routes via JWT
* `authCaptain` – protects captain routes
* Token blacklisting and role separation.

#### 2. Ride Module

* Create ride request
* Accept ride by captain
* OTP based verification
* Events broadcast to nearby captains using geospatial lookup.

#### 3. Map Module

* Get coordinates from address
* Get distance & travel time
* Autocomplete suggestions.

#### 4. Input Validation

* URL query validation → `req.query`
* JSON parsing → `req.body`
* MongoId checks for secure DB operations.

---

## Major Features

### 🚀 Users

* Register / Login
* View profile
* Request rides
* Get fare estimates
* Access map utilities.

### 🚀 Captains (Drivers)

* Register with vehicle details
* Login / Logout
* View profile
* Accept assigned rides
* Receive ride events in real time.

### 🚀 Geospatial Matching

* Nearby captain search using Mongo location indexes
* Efficient filtering for origin/destination flows.

### 🚀 Real-Time Communication

* Socket.IO events:

  * ride-requested
  * ride-accepted
  * otp-generated
  * ride-status updates.

---

## Tech Stack

* **Node.js + Express**
* **MongoDB + Mongoose**
* **Socket.IO**
* **express-validator**
* **Axios (Frontend communication)**
* **Tailwind CSS + React (Client apps)**

---

## Environment Variables

```
VITE_BASE_URL=http://localhost:3000
JWT_SECRET=your_secret
MAP_API_KEY=your_map_key
```

---

## How It All Connects

1. Client sends JSON ride data
2. `express.json()` parses → `req.body`
3. Validators sanitize inputs
4. Controller stores ride in DB
5. Map service computes fare
6. Geospatial query finds captains
7. Socket.IO notifies them
8. Captain hits accept API → ride updated & populated
9. OTP shown to user for verification.

---

## Future Enhancements

* Payment gateway integration
* Dynamic captain location tracking
* Ride completion retrace path
* Rating & review system.


* a **backend README only** with folder structure commands, or
* a shorter 10-line version for Netlify/GitHub showcase?

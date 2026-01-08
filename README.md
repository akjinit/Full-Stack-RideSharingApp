# 🚖 Real-Time Ride Booking System 

A **full-stack, real-time ride booking platform** inspired by Uber, built to explore how real-world ride-hailing systems work.  
It focuses on **authentication**, **real-time communication using Socket.IO**, **MongoDB geospatial queries**, and **OTP-based ride verification**.

This project was built as a learning-focused implementation of a realistic system, going beyond simple CRUD APIs.

---

## 📌 Key Highlights

- 🔐 JWT-based authentication with role separation
- 🔄 Real-time ride lifecycle using Socket.IO
- 🌍 Geospatial captain discovery using MongoDB
- 🔑 OTP-based ride start verification
- 👥 Separate User and Captain (Driver) flows
- 📱 UI reflecting different ride states
- 🚀 Live tracking feature planned next

---

## 🧠 Project Overview

The system simulates the core flow of a cab booking platform where:

- Users can request rides
- Nearby captains receive ride requests in real time
- Captains can accept or reject rides
- Rides start only after OTP verification
- Ride state updates are synced instantly between user and captain

The goal was to understand how such systems behave end-to-end rather than just building APIs.

---

## 📸 Screenshots (Complete Ride Flow)

### 👤 User Flow

#### Confirm Ride

#### Looking for a Driver

#### Waiting for Driver

---

### 🧑‍✈️ Captain Flow

#### New Ride Available

#### OTP Verification

---

### 🚗 Ride Lifecycle

#### Ride Ongoing

#### Ride Ongoing (User View)

#### Finish Ride

---

### 💰 Dynamic Features

#### Dynamic Fare Calculation

#### Dynamic Location Search

---

## 🔐 Authentication & Authorization

### Security Features Implemented

- JWT-based authentication
- Role-based authorization (User / Captain)
- Protected routes using middleware
- Token validation during:
  - Ride creation
  - Ride acceptance
  - Ride start
  - Ride completion

These checks help ensure that only valid users and captains can perform allowed actions at each stage of a ride.

---

## 🔄 Real-Time Communication (Socket.IO)

Socket.IO is used to keep users and captains in sync during the ride lifecycle.

### Socket Events

| Event | Description |
|------|------------|
| `join` | User/Captain joins a socket room |
| `ride-created` | Notifies nearby captains |
| `ride-accepted` | Assigns ride to one captain |
| `ride-started` | Ride begins after OTP verification |
| `ride-completed` | Updates both sides on completion |

### Architecture Pattern
- Pub-Sub style communication using socket rooms:
  - `user:<userId>`
  - `captain:<captainId>`

---

## 🌍 Geospatial Queries (MongoDB)

- MongoDB geospatial indexing
- Captains stored with their current coordinates
- Nearby captains fetched using location-based queries

This allows basic proximity-based ride matching.

---

## 🔑 OTP-Based Ride Start

- OTP generated on the server
- Ride cannot start without OTP verification
- OTP is validated before moving the ride to ONGOING state

This was added to simulate a common real-world safety step.

---

## 🚦 Ride State Flow

IDLE  
→ RIDE_REQUESTED  
→ DRIVER_ASSIGNED  
→ OTP_VERIFIED  
→ RIDE_ONGOING  
→ RIDE_COMPLETED  

Each state change is validated on the backend and reflected in real time on the client.

---

## 👤 User Features

- Create ride requests
- View estimated fare and distance
- Receive live updates:
  - Driver assigned
  - Ride started
  - Ride completed
- OTP-based ride verification

---

## 🧑‍✈️ Captain Features

- Receive nearby ride requests
- Accept or reject rides
- View pickup, drop, distance, and fare
- Start ride only after OTP verification
- Complete ride securely

---

## 🛠️ Tech Stack

### Frontend
- React
- Context API
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Real-Time
- Socket.IO

### Security
- JWT
- Middleware-based route protection
- OTP verification

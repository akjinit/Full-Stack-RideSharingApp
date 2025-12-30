# UBER Clone Backend API Documentation

## Endpoints

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

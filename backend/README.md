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

| Status Code | Description |
|------------|-------------|
| **201** | User successfully created. Returns authentication token and user object |
| **400** | Validation error. Missing or invalid fields in request body |
| **500** | Server error during user creation |

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

### POST /user/login

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

| Status Code | Description |
|------------|-------------|
| **200** | Login successful. Returns authentication token and user object |
| **400** | Validation error. Missing or invalid fields in request body |
| **401** | Unauthorized. Invalid email or password |
| **500** | Server error during login |

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

### GET /user/profile

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

| Status Code | Description |
|------------|-------------|
| **200** | Profile retrieved successfully. Returns authenticated user's profile data |
| **401** | Unauthorized. Missing or invalid authentication token |
| **500** | Server error during profile retrieval |

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

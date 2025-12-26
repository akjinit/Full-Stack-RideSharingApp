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

# Help Nearby Backend

A Node.js/Express backend API for the Help Nearby application - a location-based emergency and assistance platform that connects people in need with nearby helpers.

## Features

- User Authentication and Authorization using JWT
- Location-based Services with Geospatial Queries
- Help Request Management
- User Profiles and Ratings
- Real-time Notifications Support
- Nearby Helpers Search
- Rating and Review System

## Tech Stack

- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Help-Nearby-Backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and configure the required environment variables. Refer to the application configuration for the necessary keys.

4. Start MongoDB service
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

5. Run the application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/updatedetails | Update user details |
| PUT | /api/auth/updatepassword | Update password |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users (Admin only) |
| GET | /api/users/:id | Get single user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user (Admin only) |
| GET | /api/users/nearby-helpers | Get nearby helpers |

### Help Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/help-requests | Get all help requests |
| POST | /api/help-requests | Create help request |
| GET | /api/help-requests/nearby | Get nearby help requests |
| GET | /api/help-requests/:id | Get single help request |
| PUT | /api/help-requests/:id | Update help request |
| DELETE | /api/help-requests/:id | Delete help request |
| PUT | /api/help-requests/:id/accept | Accept help request |
| PUT | /api/help-requests/:id/complete | Complete help request |
| PUT | /api/help-requests/:id/rate | Rate completed help request |

### Locations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/locations/search | Search locations (geocoding) |
| GET | /api/locations/reverse | Reverse geocode coordinates |

## Data Models

### User
- name, email, phone, password
- role (user, helper, admin)
- location (GeoJSON Point)
- profilePicture, rating, totalHelps
- isVerified, isActive, lastSeen

### Help Request
- user, title, description
- category (medical, emergency, transport, food, shelter, assistance, other)
- priority (low, medium, high, critical)
- location (GeoJSON Point)
- status (pending, accepted, in-progress, completed, cancelled)
- helper, rating, feedback

### Notification
- user, title, message
- type (help-request, help-accepted, help-completed, rating, system)
- relatedRequest, isRead

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Location Queries

The API supports geospatial queries to find nearby help requests and helpers. Coordinates should be provided as:
- longitude: -180 to 180
- latitude: -90 to 90

Example query:
```
GET /api/help-requests/nearby?longitude=77.5946&latitude=12.9716&radius=5
```

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Contact

For questions or support, please open an issue in the repository.
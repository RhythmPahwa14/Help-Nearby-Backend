# Help Nearby Backend

A Node.js/Express backend API for the Help Nearby application - a location-based community assistance platform that connects people in need with nearby helpers.

**Live API:** [Help Nearby Backend](https://help-nearby-backend.vercel.app)  
**Frontend Repo:** https://github.com/RhythmPahwa14/Help-Nearby  
**Backend Repo:** https://github.com/RhythmPahwa14/Help-Nearby-Backend

## Features

- **User Authentication & Authorization** - JWT-based secure authentication
- **Location-Based Services** - MongoDB geospatial queries with 2dsphere indexing
- **Help Request Management** - CRUD operations for help requests
- **Help Offers System** - Users can offer help with contact details
- **User Profiles & Ratings** - Track helpers and their ratings
- **Real-time Notifications Support** - Ready for real-time integration
- **Nearby Search** - Find helpers and requests within radius
- **Rating & Review System** - Rate completed help requests

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL Database with Geospatial support
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and encryption

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) or MongoDB Atlas account
- npm or yarn

## Getting Started

### Installation

1. Clone the repository
```bash
git clone https://github.com/RhythmPahwa14/Help-Nearby-Backend.git
cd Help-Nearby-Backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start MongoDB service (if using local MongoDB)
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

6. Run the application
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/me` | Get current user | Yes |
| PUT | `/updatedetails` | Update user details | Yes |
| PUT | `/updatepassword` | Update password | Yes |

### Users (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all users | Admin |
| GET | `/:id` | Get single user | Yes |
| PUT | `/:id` | Update user | Yes |
| DELETE | `/:id` | Delete user | Admin |
| GET | `/nearby-helpers` | Get nearby helpers | Yes |

### Help Requests (`/api/help-requests`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all help requests | Yes |
| POST | `/` | Create help request | Yes |
| GET | `/nearby` | Get nearby help requests | Yes |
| GET | `/:id` | Get single help request | Yes |
| PUT | `/:id` | Update help request | Yes |
| DELETE | `/:id` | Delete help request | Yes |
| **POST** | **`/:id/offer-help`** | **Offer help with contact details** | **Yes** |
| PUT | `/:id/accept` | Accept help request | Yes |
| PUT | `/:id/complete` | Complete help request | Yes |
| PUT | `/:id/rate` | Rate completed request | Yes |

### Locations (`/api/locations`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/search` | Search locations (geocoding) | No |
| GET | `/reverse` | Reverse geocode coordinates | No |

## Data Models

### User
- name, email (unique), phone, password (hashed)
- role: user, helper, admin
- location with GeoJSON Point coordinates
- profilePicture, rating, totalHelps
- isVerified, isActive, lastSeen

### Help Request
- user, title, description
- category: medical, emergency, transport, food, shelter, assistance, other
- priority: low, medium, high, critical
- location with GeoJSON Point coordinates
- status: pending, accepted, in-progress, completed, cancelled
- helper, helpOffers array, rating, feedback

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login/register, include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Geospatial Queries

The API uses MongoDB's geospatial features to find nearby requests and helpers.

### Nearby Help Requests
```http
GET /api/help-requests/nearby?longitude=77.5946&latitude=12.9716&radius=10
```

Parameters:
- `longitude`: -180 to 180 (required)
- `latitude`: -90 to 90 (required)  
- `radius`: Distance in kilometers (default: 10)

### Nearby Helpers
```http
GET /api/users/nearby-helpers?longitude=77.5946&latitude=12.9716&radius=5
```

## New Feature: Help Offers

Users can now offer help on requests by providing their contact details:

### Offer Help Endpoint
```
POST /api/help-requests/:id/offer-help
Body: { name, phone, email (optional), message (optional) }
```

Multiple users can offer help on the same request with their contact details.

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Server Error

## Deployment

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Set environment variables in Vercel dashboard
4. Use MongoDB Atlas for production database

### Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Environment Variables for Production
Set the same environment variables as in `.env` with production values.

## API Testing

Use Postman, Thunder Client (VS Code extension), or cURL for API testing.

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (if configured)

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For Atlas: Whitelist your IP address

### JWT Issues
- Ensure `JWT_SECRET` is set in `.env`
- Check token format in Authorization header
- Verify token hasn't expired

### Port Conflicts
- Change `PORT` in `.env` if 5000 is occupied
- Kill process using port: `npx kill-port 5000`

### Geospatial Query Errors
- Ensure coordinates are [longitude, latitude] (not reversed!)
- Verify 2dsphere indexes exist: `db.helprequests.getIndexes()`

## Project Structure

```
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── helpRequestController.js  # Help request CRUD + offer help
│   └── userController.js  # User management
├── middleware/
│   └── auth.js            # JWT verification middleware
├── models/
│   ├── User.js            # User schema with geospatial support
│   ├── HelpRequest.js     # Help request schema with helpOffers
│   └── Notification.js    # Notification schema (future use)
├── routes/
│   ├── auth.js            # Auth routes
│   ├── helpRequests.js    # Help request routes
│   ├── users.js           # User routes
│   └── locations.js       # Location/geocoding routes
├── .env                   # Environment variables (not in git)
├── .env.example           # Example env file
├── .gitignore
├── package.json
├── server.js              # Entry point
└── vercel.json            # Vercel deployment config
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

ISC

## Author

**Rhythm Pahwa**
- GitHub: [@RhythmPahwa14](https://github.com/RhythmPahwa14)

## Contact

For questions or support, please open an issue in the repository.

---

**Note:** This is the backend API. For the frontend application, visit: [Help Nearby Frontend](https://github.com/RhythmPahwa14/Help-Nearby)
- `DELETE /api/help-requests/:id` - Delete help request
- `PUT /api/help-requests/:id/accept` - Accept help request
- `PUT /api/help-requests/:id/complete` - Complete help request
- `PUT /api/help-requests/:id/rate` - Rate completed help request

### Locations
- `GET /api/locations/search` - Search locations (geocoding)
- `GET /api/locations/reverse` - Reverse geocode coordinates

## Data Models

### User
- name, email, phone, password
- role (user/helper/admin)
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
MAPS Project
Overview
This project implements a web-based map application using React JS (frontend) and Express JS (backend). It includes user authentication, a dashboard, and an interactive map view of India, powered by OpenStreetMap and Leaflet.
Features
•	User Registration & Login with JWT authentication
•	Dashboard displaying navigable cards
•	Map view with OpenStreetMap integration
•	Back button on the map page to navigate back to the dashboard
•	Token-based route protection
________________________________________
Setup
1. Backend Setup
1.	Install dependencies:
2.	cd backend
npm install express bcrypt jwt cors
3.	Run the backend server:
node 
Backend runs on http://localhost:5000
2. Frontend Setup
1.	Install dependencies:
2.	cd frontend
npm install react-router-dom axios leaflet react-leaflet
3.	Run the frontend development server:
npm start
Frontend runs on http://localhost:3000
________________________________________
API Endpoints
User Registration
POST /api/register
Request Body:
{
  "username": "admin",
  "password": "mypassword"
}
Response:
{
  "message": "User registered successfully"
}
Login
POST /api/login
Request Body:
{
  "username": "admin",
  "password": "mypassword"
}
Response:
{
  "token": "<JWT token>"
}
Dashboard
GET /api/dashboard
Authorization: Bearer <JWT token>
Response:
{
  "message": "Welcome admin",
  "cards": [1, 2, 3]
}
Map View
GET /api/map
Authorization: Bearer <JWT token>
Response:
{
  "message": "Hi admin, here’s the map!",
  "location": { "lat": 20.5937, "lng": 78.9629, "zoom": 5 }
}
________________________________________
Components Breakdown
Login.js
•	Handles user login with axios POST request
•	Stores token in localStorage
•	Redirects to dashboard on successful login
Dashboard.js
•	Fetches card data from /api/dashboard
•	Each card navigates to the corresponding map view
MapView.js
•	Displays OpenStreetMap centered on India
•	Includes a Back to Dashboard button
•	Marker with popup showing 'India's Center Point'
________________________________________
Enhancements
•	✅ Added JWT route protection
•	✅ Implemented map navigation with a back button

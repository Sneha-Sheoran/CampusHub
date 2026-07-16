# CampusHub Backend

A scalable REST API for the CampusHub student portal built with Node.js and Express. It supports notes, lost & found, marketplace, complaints, events, and notices using JSON file storage.

## Features
- RESTful CRUD endpoints for all major modules
- Validation for required fields and phone numbers
- Error handling for 400, 404, and 500 responses
- Search and sorting support via query parameters
- JSON file-based persistence for easy future migration to a database

## Installation
```bash
cd Backend
npm install
```

## Run locally
```bash
npm run dev
```

The API will be available at http://localhost:5000

## API Overview
- GET /api/notes
- POST /api/notes
- PUT /api/notes/:id
- DELETE /api/notes/:id
- GET /api/lost-items
- POST /api/lost-items
- PUT /api/lost-items/:id
- DELETE /api/lost-items/:id
- GET /api/marketplace
- POST /api/marketplace
- PUT /api/marketplace/:id
- DELETE /api/marketplace/:id
- GET /api/complaints
- POST /api/complaints
- PUT /api/complaints/:id
- DELETE /api/complaints/:id
- GET /api/events
- POST /api/events
- PUT /api/events/:id
- DELETE /api/events/:id
- GET /api/notices
- POST /api/notices
- PUT /api/notices/:id
- DELETE /api/notices/:id

## Example requests
```bash
curl http://localhost:5000/api/notes
curl "http://localhost:5000/api/events?search=hackathon"
```

## Future improvements
- Add authentication and authorization
- Move storage from JSON files to MongoDB or PostgreSQL
- Add pagination and filtering by category
- Add admin dashboard and audit logging

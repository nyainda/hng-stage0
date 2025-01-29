# Public API for HNG12 Task Submission

## Project Description
This is a simple public API developed for the HNG12 task. The API provides the following information in JSON format:

- **Email Address:** The email address used to register on the HNG12 Slack workspace.
- **Current Date and Time:** Dynamically generated in ISO 8601 format (UTC).
- **GitHub URL:** The link to the project's codebase hosted on GitHub.

The API is implemented using Node.js and Express, and is publicly accessible.

---

## Setup Instructions

### Prerequisites
- **Node.js:** Ensure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo
   cd your-repo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
1. Start the server:
   ```bash
   node server.js
   ```
2. The server will start at `http://localhost:3000`

---

## API Documentation

### Endpoint
- **GET** `/api`

### Request Example
```bash
curl http://localhost:3000/api
```

### Response Format
**200 OK**
```json
{
  "email": "oyugibruce2017@gmail.com",
  "current_datetime": "2025-01-30T09:30:00Z",
  "github_url": "https://github.com/nyainda/hng-stage0"
}
```

### Error Responses
- **404 Not Found:** Route not found.
- **500 Internal Server Error:** An unexpected error occurred.

---

## Deployment
This API is deployed and publicly accessible at:
```
<your-public-url>
```

---

## CORS Handling
The API is configured to allow Cross-Origin Resource Sharing (CORS) for all domains using the following settings:
```javascript
app.use(cors({
    origin: '*',  
    methods: ['GET']  
}));
```

---

## Code Structure
- **server.js:** Main entry point of the application.
- **package.json:** Contains project metadata and dependencies.

---

## Relevant Links
- [Hire Node.js Developers](https://hng.tech/hire/nodejs-developers)

---

## Submission Checklist
- [x] Hosted API on a public platform
- [x] Verified functionality and adherence to specifications
- [x] Included well-structured documentation in README.md



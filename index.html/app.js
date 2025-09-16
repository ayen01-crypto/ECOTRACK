const express = require('express');
const cors = require('cors'); // Import the package
const app = express();

// Middleware
app.use(express.json()); // For parsing application/json

// Enable CORS for all routes
// This is the simplest solution for development.
app.use(cors());

// OR for more control (e.g., only allowing your frontend)
// app.use(cors({
//   origin: 'http://localhost:3000' // Your frontend's URL
// }));

// ... your routes (e.g., auth routes) go here ...

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
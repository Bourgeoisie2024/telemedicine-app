const express = require("express");
const router = express.Router();

// Define routes for appointments
router.get("/", (req, res) => {
  res.send("Appointments route");
});

// Add more routes as needed
// Example: router.post('/book', (req, res) => { ... });

module.exports = router;

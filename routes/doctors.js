const express = require("express");
const router = express.Router();

// Define routes for doctors
router.get("/", (req, res) => {
  res.send("Doctors route");
});

// Add more routes as needed
// Example: router.post('/schedule', (req, res) => { ... });

module.exports = router;

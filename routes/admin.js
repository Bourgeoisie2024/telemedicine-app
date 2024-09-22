const express = require("express");
const router = express.Router();

// Define routes for admin
router.get("/", (req, res) => {
  res.send("Admin route");
});

// Add more routes as needed
// Example: router.post('/manage', (req, res) => { ... });

module.exports = router;

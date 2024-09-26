const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db"); // Database connection

// Define routes for patients
router.get("/", (req, res) => {
  res.send("Patients route");
});

// Registration
router.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    date_of_birth,
    gender,
    address,
  } = req.body;

  try {
    const password_hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO Patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        first_name,
        last_name,
        email,
        password_hash,
        phone,
        date_of_birth,
        gender,
        address,
      ],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error registering patient");
        } else {
          res.send("Patient registered successfully");
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering patient");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    db.query(
      "SELECT * FROM Patients WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          res.status(500).send("Error logging in");
        } else if (results.length > 0) {
          console.log("User found:", results[0]);
          console.log("Received password:", password);
          console.log("Stored hash:", results[0].password_hash);

          const match = await bcrypt.compare(
            password,
            results[0].password_hash
          );
          if (match) {
            req.session.patientId = results[0].id;
            res.send("Login successful");
          } else {
            console.log("Password mismatch");
            res.status(401).send("Incorrect password");
          }
        } else {
          console.log("No user found with this email");
          res.status(404).send("No user found with this email");
        }
      }
    );
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in");
  }
});

module.exports = router;

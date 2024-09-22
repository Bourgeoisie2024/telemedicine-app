const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db"); // Database connection

// Define routes for patients
router.get("/", (req, res) => {
  res.send("Patients route");
});

// Add more routes as needed
// Example: router.post('/register', (req, res) => { ... });

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
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM Patients WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error logging in");
      } else if (results.length > 0) {
        const match = await bcrypt.compare(password, results[0].password_hash);
        if (match) {
          req.session.patientId = results[0].id;
          res.send("Login successful");
        } else {
          res.status(401).send("Incorrect password");
        }
      } else {
        res.status(404).send("No user found with this email");
      }
    }
  );
});

module.exports = router;

/*Explanation for the Above: 

Registration Route (/register):
This route handles patient registration. It hashes the password using bcryptjs and inserts the patient details into the Patients table.
If the registration is successful, it sends a success message. If there’s an error, it logs the error and sends an error message.

Login Route (/login):
This route handles patient login. It checks if the email exists in the Patients table and compares the provided password with the stored hashed password.
If the login is successful, it sets the patient ID in the session and sends a success message. If the password is incorrect or the email doesn’t exist, it sends an appropriate error message.

Next Steps
Save the File: Save the changes to routes/patients.js.
Run the Server: Start your server by running: node app.js

Test the Endpoints: Use a tool like Postman to test the registration and login endpoints:
Registration: POST http://localhost:4000/patients/register*/

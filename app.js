const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();
const port = 4000; // Changed port to 4000

// MySQL connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Nimalamysql2024", // Replace this with your actual MySQL password
  database: "telemedicine_db",
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Routes
app.use("/patients", require("./routes/patients"));
app.use("/doctors", require("./routes/doctors"));
app.use("/appointments", require("./routes/appointments"));
app.use("/admin", require("./routes/admin"));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Telemedicine App!");
});

// Define the register route
app.post("/patients/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); // Log the hashed password
    const query =
      "INSERT INTO patients (name, email, password_hash) VALUES (?, ?, ?)";
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res
          .status(500)
          .send("Error registering patient: " + err.message);
      }
      res.status(201).send("Patient registered!");
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).send("Error registering patient");
  }
});

// Define the login route
app.post("/patients/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM patients WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).send("Error logging in: " + err.message);
    }
    if (results.length === 0) {
      console.log("No user found with email:", email);
      return res.status(404).send("Invalid email or password");
    }
    const user = results[0];
    console.log("User found:", user);
    console.log("Received password:", password);
    console.log("Stored hash:", user.password_hash);
    const match = await bcrypt.compare(password, user.password_hash);
    if (match) {
      req.session.patientId = user.id;
      res.send("Patient logged in!");
    } else {
      console.log("Password mismatch for user:", email);
      res.status(401).send("Incorrect password");
    }
  });
});

// Check session route
app.get("/check-session", (req, res) => {
  console.log("Session data:", req.session);
  res.send("Session data logged in console");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

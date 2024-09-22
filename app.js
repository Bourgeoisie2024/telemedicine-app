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

// I add Routes for my two requests on POSTMAN
// Define the register route and modify registration route to has password before storing it in the database
app.post("/patients/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
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
      return res.status(500).send("Error logging in: " + err.message);
    }
    if (results.length === 0) {
      return res.status(404).send("Invalid email or password");
    }
    const match = await bcrypt.compare(password, results[0].password_hash);
    if (match) {
      req.session.patientId = results[0].id;
      res.send("Patient logged in!");
    } else {
      res.status(401).send("Incorrect password");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Nimalamysql2024", // Replace this with your actual MySQL password
  database: "telemedicine_db",
});

module.exports = db;

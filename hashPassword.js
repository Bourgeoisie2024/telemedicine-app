const bcrypt = require("bcrypt");

async function hashPassword(password) {
  try {
    const password_hash = await bcrypt.hash(password, 10);
    return password_hash; // Return the hashed password
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err; // Throw the error to handle it in the calling function
  }
}

// Example usage
(async () => {
  const hashedPassword = await hashPassword("password123");
  console.log(hashedPassword); // Log the hashed password
})();

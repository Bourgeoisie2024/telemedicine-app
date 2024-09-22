const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const port = 4000;

app.use(express.json());

const getUserByEmail = async (email) => {
  // Mock user data
  const users = [
    {
      email: "john.doe@example.com",
      hashedPassword:
        "$2a$10$Bl1n9IXqO60M6BhrDivctuVqJKhe0xzU7DKTeQLrjNwLIwSAfBmrm",
    },
  ];
  return users.find((user) => user.email === email);
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (user) {
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (match) {
        res.status(200).send("Login successful");
      } else {
        res.status(401).send("Invalid password");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

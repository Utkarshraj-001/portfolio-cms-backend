const express = require("express");
const router = express.Router();


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@1111.com" && password === "123456") {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;

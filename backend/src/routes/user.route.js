const { login } = require("../controllers/user.controller.js");
const express = require("express");

const router = express.Router();

router.post("/login", login);

module.exports = router;

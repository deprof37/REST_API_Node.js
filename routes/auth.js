const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");
const User = require("../models/user");

router.put(
  "/signup",
  [
    body("name").trim().not().isEmpty(),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;

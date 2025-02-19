const { check } = require("express-validator");

exports.refferalValidator = [
  check("name", "Name is required").notEmpty(),
  check("email", "Valid email is required").isEmail().normalizeEmail(),
  check("phone", "Mobile number should be exactly 10 digits").isLength({
    min: 10,
    max: 10,
  }),
  check("refferCode", "Referral code must be 6 digits").isLength({
    min: 6,
    max: 6,
  }),
  check("refferName", "Name is required").notEmpty(),
];

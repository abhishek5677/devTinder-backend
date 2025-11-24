const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("First Name is required");
  } else if (!lastName) {
    throw new Error("Last Name is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a valid Password");
  }
};

module.exports = { validateSignUpData };

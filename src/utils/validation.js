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

const validateEditProfileData = (req) => {
  const allowedEditFields = ["photoUrl", "Gender", "skills", "age", "about"];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedEditFields.includes(field);
  });

  return isEditAllowed;
};

const validateForgotPasswordData = (req) => {
  const { emailId, oldPassword, newPassword } = req.body;

  if (!emailId) {
    throw new Error("Email Id is required");
  } else if (!oldPassword) {
    throw new Error("Old Password is required");
  } else if (!newPassword) {
    throw new Error("New Password is required");
  }
};

module.exports = {
  validateSignUpData,
  validateForgotPasswordData,
  validateEditProfileData,
};

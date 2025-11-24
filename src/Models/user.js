const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },

    password: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value);
        },
        message: (props) => `${props.value} is not a valid password!`,
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: undefined, // NO default value
      validate: {
        validator: function (value) {
          if (!value) return true; // 👉 DO NOT validate when value is missing
          return validator.isURL(value); // 👉 validate only if value exists
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    about: {
      type: String,
      default: "This is my default about summary",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

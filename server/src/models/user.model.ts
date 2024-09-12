import { Document, model, Model, Schema } from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  gender: "male" | "female";
  dateOfBirth: Date;
  role: "user" | "guide" | "lead-guide" | "admin";
  email: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
}

interface IUserMethods {}

interface IUserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser, IUserMethods, IUserModel>(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name."],
      minlength: [3, "First name must be at least 3 characters."],
      maxlength: [10, "First name must not exceed 10 characters."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name."],
      minlength: [3, "Last name must be at least 3 characters."],
      maxlength: [10, "Last name must not exceed 10 characters."],
      trim: true,
    },
    username: String,
    gender: {
      type: String,
      required: [true, "Please specify your gender."],
      enum: {
        values: ["male", "female"],
        message: "Gender is must be either 'male' or 'female'",
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please provide your date of birth."],
      validate: {
        validator: (value) => value < new Date(),
        message: "Date of birth must be in the past.",
      },
    },
    role: {
      type: String,
      required: [true, "Please specify your role."],
      enum: {
        values: ["user", "guide", "lead-guide", "admin"],
        message:
          "Role is must be either 'user', 'guide', 'lead-guide', or 'admin'",
      },
      default: "user",
    },
    email: {
      type: String,
      required: [true, "Please provide your email address."],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Please provide a strong password."],
      minlength: [8, "Password must be at least 8 characters."],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      ],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password."],
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: "Passwords do not match.",
      },
      select: false,
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = model<IUser, IUserModel>("User", userSchema);

export default User;

import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    min: 4,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  type: {
    type: String,
    required: true,
    default: "normal",
  },
});

export default mongoose.model("User", UserSchema);

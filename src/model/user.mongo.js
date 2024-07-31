import mongoose from "mongoose";

const UserMongo = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      //only these values are allowed in this field
      enum: ["male", "female"],
    },
    age: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserMongo);

import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const User = model("User", userSchema);

export { User };

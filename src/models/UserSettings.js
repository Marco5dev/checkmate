import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema({
  theme: {
    type: String,
    required: true,
  },
  wallpaper: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.UserSettings ||
  mongoose.model("UserSettings", UserSettingsSchema);

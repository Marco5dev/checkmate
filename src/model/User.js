import mongoose from "mongoose";

const platformSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ["github", "credentials"],
  },
  username: {
    type: String,
    required: true,
  },
  profileUrl: String,
  connectedAt: {
    type: Date,
    default: Date.now,
  },
  lastUsed: {
    type: Date,
    default: Date.now,
  },
});

export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true, // Remove this if using schema.index()
      unique: true,
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores",
      ],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true, // Remove this if using schema.index()
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    password_changes: {
      type: Number,
      default: 0,
      required: true,
    },
    avatar: {
      filename: String,
      contentType: String,
      base64: String,
      createdAt: Date,
      updatedAt: Date,
    },
    primaryProvider: {
      type: String,
      enum: ["github", "credentials"],
      required: true,
      default: "credentials",
    },
    connectedPlatforms: [platformSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Add instance methods
userSchema.methods = {
  hasPassword() {
    return this.password_changes > 0;
  },
  isPlatformConnected(platform) {
    return this.connectedPlatforms.some((p) => p.provider === platform);
  },
  getPlatformInfo(platform) {
    return this.connectedPlatforms.find((p) => p.provider === platform);
  },
  async updatePlatformLastUsed(platform) {
    const platformDoc = this.connectedPlatforms.find(
      (p) => p.provider === platform
    );
    if (platformDoc) {
      platformDoc.lastUsed = new Date();
      await this.save();
    }
  },
};

// Add virtual properties
userSchema.virtual("authMethods").get(function () {
  const methods = this.connectedPlatforms.map((p) => p.provider);
  if (this.hasPassword()) methods.push("credentials");
  return [...new Set(methods)];
});

// Update lastLogin on every save if it's a new document
userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

// Don't return password in JSON
userSchema.set("toJSON", {
  transform: function (doc, ret, opt) {
    delete ret.password;
    return ret;
  },
});

// Only create the model on the server side
const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;

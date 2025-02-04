import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI;

export async function DBConnect() {
  if(mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(MONGO_URI)
      console.log("Users DB is connected!")
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else {
    console.log("Users DB is already connected!");
  }
}
'use server'

import { DBConnect } from "@/utils/mongodb";
import User from "@/model/User";

export async function getUserByEmail(email) {
  await DBConnect();
  return await User.findOne({ email }).lean();
}

export async function updateUser(userId, data) {
  await DBConnect();
  return await User.findByIdAndUpdate(userId, data, { new: true }).lean();
}

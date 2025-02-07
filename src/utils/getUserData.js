import { DBConnect } from "./mongodb";
import User from "@/models/User";

export async function getUserData(userId) {
  await DBConnect();
  const userData = await User.findById(userId).lean();
  
  return {
    id: userData._id.toString(),
    name: userData.name,
    email: userData.email,
    username: userData.username,
    avatar: userData.avatar,
    role: userData.role
  };
}

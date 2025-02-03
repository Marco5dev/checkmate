import { NextResponse } from "next/server";
import User from "@/model/User";
import { DBConnect } from "@/utils/mongodb";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/utils/emailService";

export async function POST(request) {
  try {
    await DBConnect();
    const { email, username, password, name } = await request.json();

    // Check for existing email/username before creating user
    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email: email.toLowerCase() }),
      User.findOne({ username: username.toLowerCase() })
    ]);

    const errors = {};
    
    if (existingEmail) {
      errors.email = "This email is already registered";
    }
    
    if (existingUsername) {
      errors.username = "This username is already taken";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ 
        message: "Validation failed",
        errors 
      }, { status: 409 });
    }

    // If no duplicates, proceed with user creation
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new User({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      password_changes: 1,
      primaryProvider: "credentials"
    });

    // Generate and set verification token
    const { token, expires } = await sendVerificationEmail(user);
    user.verificationToken = token;
    user.verificationTokenExpires = expires;

    await user.save();

    return NextResponse.json({
      message: "Registration successful! Please check your email to verify your account.",
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle MongoDB duplicate key errors that might slip through
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        message: "Validation failed",
        errors: {
          [field]: `This ${field} is already taken`
        }
      }, { status: 409 });
    }

    return NextResponse.json({ 
      message: "Something went wrong during registration"
    }, { status: 500 });
  }
}

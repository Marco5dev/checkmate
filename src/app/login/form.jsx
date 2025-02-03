"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faLock,
  faSignature,
  faUser,
  faEyeLowVision,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast"; // Add this import

export default function Form() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "login";
  const [formType, setFormType] = useState("login");
  const [isAnimating, setIsAnimating] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [email, setEmail] = useState("");
  const [Error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const session = useSession();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    // Regular expression to match spaces and uppercase letters
    const regex = /^[a-z0-9]*$/;

    if (regex.test(value)) {
      setUsername(value);
      setError("");
    } else {
      setError("Username cannot contain spaces or uppercase letters.");
    }
  };

  function evaluatePasswordStrength(password) {
    let score = 0;

    if (!password) return "";

    // Check password length
    if (password.length > 8) score += 1;
    // Contains lowercase
    if (/[a-z]/.test(password)) score += 1;
    // Contains uppercase
    if (/[A-Z]/.test(password)) score += 1;
    // Contains numbers
    if (/\d/.test(password)) score += 1;
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
      case 2:
        return "Weak";
      case 3:
        return "Medium";
      case 4:
      case 5:
        return "Strong";
    }
  }

  const handleRegisteration = async (e) => {
    e.preventDefault();
    setErrorEmail("");
    setErrorUsername("");

    try {
      const response = await axios.post("/api/register", {
        username,
        name,
        email,
        password,
      });

      const data = response.data;
      
      if (response.status === 201) {
        toast.success(data.message);
        return router.push("/login?type=login");
      }
    } catch (error) {
      if (error.response) {
        // Handle Axios errors
        if (error.response.status === 409) {
          const { errors } = error.response.data;
          if (errors.email) {
            setErrorEmail(errors.email);
            toast.error(errors.email);
          }
          if (errors.username) {
            setErrorUsername(errors.username);
            toast.error(errors.username);
          }
        } else {
          toast.error(error.response.data.message || "An unexpected error occurred");
        }
      } else {
        console.error("Error:", error.message);
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      toast.error(res.error);
      setError(res.error);
    } else {
      toast.success("Login successful!");
      return router.push("/");
    }
  };

  const handleGithubSignIn = async () => {
    await signIn("github", { callbackUrl: "/" });
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.replace("/");
    }
  }, [session, router]);

  useEffect(() => {
    if (type && type !== formType) {
      setIsAnimating(true);
      setTimeout(() => {
        setFormType(type);
        setIsAnimating(false);
      }, 300);
    }
  }, [type, formType]);

  return (
    <div className="login-bg flex justify-center items-start lg:items-center w-screen h-screen mt-10 lg:mt-0 bg-cover bg-no-repeat bg-center">
      <div className="w-full max-w-md">
        <h1 className="text-xl lg:text-2xl font-bold text-center mb-8 uppercase">
          {formType === "register" ? "Register" : "Login"}
        </h1>
        <div
          className={`transition-all duration-300 justify-center content-center items-center flex transform ${
            isAnimating
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          {formType === "register" ? (
            <div className="login-container shadow-2xl w-[95%] lg:w-[450px]">
              <form className="login-form" onSubmit={handleRegisteration}>
                <div className="login-flex-column">
                  <label>{"The Name"}</label>
                </div>
                <div className="login-inputForm">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="w-[20px] h-[20px]"
                  />
                  <input
                    type="text"
                    required
                    className="login-input"
                    placeholder={"Enter your Full Name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="login-flex-column">
                  <label>{"Username"}</label>
                </div>
                <div className="login-inputForm">
                  <FontAwesomeIcon
                    icon={faSignature}
                    className={`w-[20px] h-[20px] ${errorUsername ? 'text-error' : ''}`}
                  />
                  <input
                    type="username"
                    required
                    className={`login-input ${errorUsername ? 'border-error' : ''}`}
                    placeholder={"Enter Your Username"}
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                {errorUsername && (
                  <div className="flex-row flex max-w-[95%]">
                    <p className="text-error text-sm">{errorUsername}</p>
                  </div>
                )}
                <div className="login-flex-column">
                  <label>{"Email"}</label>
                </div>
                <div className="login-inputForm">
                  <FontAwesomeIcon 
                    icon={faAt} 
                    className={`w-[20px] h-[20px] ${errorEmail ? 'text-error' : ''}`}
                  />
                  <input
                    type="email"
                    required
                    className={`login-input ${errorEmail ? 'border-error' : ''}`}
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorEmail("");
                    }}
                  />
                </div>
                {errorEmail && (
                  <div className="flex-row flex max-w-[95%]">
                    <p className="text-error text-sm">{errorEmail}</p>
                  </div>
                )}
                <div className="login-flex-column">
                  <label>{"Password"}</label>
                </div>
                <div className="login-inputForm">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="w-[20px] h-[20px]"
                  />
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    className="login-input"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setStrength(evaluatePasswordStrength(e.target.value));
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-square btn-ghost rounded-2xl text-gray-500"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <FontAwesomeIcon
                        icon={faEyeLowVision}
                        className="w-5 h-5"
                      /> // Optional: Eye icon for hidden state
                    ) : (
                      <FontAwesomeIcon icon={faEye} className="w-5 h-5" /> // Optional: Eye icon for visible state
                    )}
                  </button>
                </div>
                <div className="flex-row flex gap-2">
                  Password strength:{" "}
                  <p
                    className={`${
                      strength === "Weak"
                        ? "text-red-500"
                        : strength === "Medium"
                        ? "text-orange-500"
                        : strength === "Strong"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {strength || "Unknown"}
                  </p>
                </div>
                <p className="text-red-500">{Error}</p>
                <button className="login-button-submit" type="submit">
                  {"Register"}
                </button>
              </form>
              <p className="login-p">{"Or Continue With"}</p>
              <div className="login-flex-col">
                <button
                  onClick={handleGithubSignIn}
                  className="login-btn github"
                  type="button"
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="w-[20px] h-[20px]"
                  />
                  GitHub
                </button>
              </div>
              <p className="login-p">
                {"Already have an account?"}{" "}
                <Link href="/login?type=login" className="btn btn-link">
                  {"Login"}
                </Link>
              </p>
            </div>
          ) : (
            <div className="login-container shadow-2xl w-[95%] lg:w-[450px]">
              <form className="login-form" onSubmit={handleLogin}>
                <div className="login-flex-column">
                  <label>{"Email"}</label>
                </div>
                <div className="login-inputForm">
                  <FontAwesomeIcon icon={faAt} className="w-[20px] h-[20px]" />
                  <input
                    type="email"
                    required
                    className="login-input"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="login-flex-column">
                  <label>{"Password"}</label>
                </div>
                <div className="login-inputForm">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="w-[20px] h-[20px]"
                  />
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    className="login-input"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-square btn-ghost rounded-2xl text-gray-500"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <FontAwesomeIcon
                        icon={faEyeLowVision}
                        className="w-5 h-5"
                      /> // Optional: Eye icon for hidden state
                    ) : (
                      <FontAwesomeIcon icon={faEye} className="w-5 h-5" /> // Optional: Eye icon for visible state
                    )}
                  </button>
                </div>
                <div className="login-flex-row">
                  <div className="content-center items-center flex flex-row gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                    />
                    <label>{"Remember Me"}</label>
                  </div>
                  <span className="login-span">{"Forgot Password?"}</span>
                </div>
                <button className="login-button-submit" type="submit">
                  {"Login"}
                </button>
              </form>
              <p className="login-p">{"Or Continue With"}</p>
              <div className="login-flex-col">
                <button
                  onClick={handleGithubSignIn}
                  className="login-btn github"
                  type="button"
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="w-[20px] h-[20px]"
                  />
                  Github
                </button>
              </div>
              <p className="login-p">
                {"Don't have an account?"}{" "}
                <Link href="/login?type=register" className="btn btn-link">
                  {"Register"}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import {
  Mail,
  Lock,
  LogIn,
  User,
  Phone,
  Building,
  MapPin,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";

import hero1 from "../assets/images/hero/DSC05274.jpg";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    address: "",
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const fromQuote = params.get("quote") === "true";
  const mode = params.get("mode");

  useEffect(() => {
    if (mode === "register") {
      setIsLogin(false);
    }
  }, [mode]);

  const getRedirectPath = (role) => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "driver") return "/driver/dashboard";
    return "/customer/dashboard";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success(
        fromQuote
          ? "Login successful! You can now request your quote."
          : "Login successful!"
      );

      navigate(getRedirectPath(result.user.role), {
        state: fromQuote ? { openQuoteForm: true } : undefined,
      });
    } else {
      toast.error(result.error);
    }

    setLoginLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);

    const userData = {
      ...registerData,
      role: "customer",
    };

    const result = await register(userData);

    if (result.success) {
      toast.success(
        fromQuote
          ? "Registration successful! You can now request your quote."
          : "Registration successful!"
      );

      navigate("/customer/dashboard", {
        state: fromQuote ? { openQuoteForm: true } : undefined,
      });
    } else {
      toast.error(result.error);
    }

    setRegisterLoading(false);
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-6"
      style={{
        backgroundImage: `url(${hero1})`,
      }}
    >
      <div className="absolute inset-0 z-10 bg-black/70" />

      <Motion.div
        initial={{ opacity: 0, y: 70, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="relative z-20 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-xl bg-white px-6 pb-6 pt-5 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center leading-none">
          <img
            src={logo}
            alt="Naglink Logo"
            className="mb-4 h-24 w-72 object-contain"
          />

          <h1 className="text-3xl font-bold text-blue-900">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>

          <p className="mt-3 text-sm font-semibold text-blue-600">
            {isLogin
              ? "Enter your Email & Password to Login"
              : "Register as a customer to continue"}
          </p>
        </div>

        {fromQuote && (
          <div className="mt-5 rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 text-sm font-semibold leading-6 text-orange-800">
            <div className="flex items-start gap-3">
              <FileText size={20} className="mt-0.5 shrink-0" />
              <p>
                Please login first so you can request a quote and receive the
                admin reply directly through the system.
              </p>
            </div>
          </div>
        )}

        {isLogin ? (
          <>
            <form onSubmit={handleLogin} className="mt-6 space-y-5">
              <div className="flex h-12 overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-blue-600">
                <div className="flex w-12 items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-800">
                  <Mail size={20} />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 text-gray-800 outline-none"
                  required
                />
              </div>

              <div className="flex h-12 overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-blue-600">
                <div className="flex w-12 items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-800">
                  <Lock size={20} />
                </div>

                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 text-gray-800 outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="flex w-12 items-center justify-center text-gray-700 hover:text-blue-600"
                >
                  {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-md bg-blue-600 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <LogIn size={20} />
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-900">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="font-bold text-blue-600 hover:underline"
              >
                Create an account
              </button>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div className="flex h-12 overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-blue-600">
                <div className="flex w-12 items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-800">
                  <User size={20} />
                </div>

                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      username: e.target.value,
                    })
                  }
                  placeholder="Username"
                  className="w-full px-4 text-gray-800 outline-none"
                  required
                />
              </div>

              <div className="flex h-12 overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-blue-600">
                <div className="flex w-12 items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-800">
                  <Mail size={20} />
                </div>

                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    })
                  }
                  placeholder="Email address"
                  className="w-full px-4 text-gray-800 outline-none"
                  required
                />
              </div>

              <div className="flex h-12 overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-blue-600">
                <div className="flex w-12 items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-800">
                  <Lock size={20} />
                </div>

                <input
                  type={showRegisterPassword ? "text" : "password"}
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  placeholder="Password"
                  className="w-full px-4 text-gray-800 outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowRegisterPassword(!showRegisterPassword)
                  }
                  className="flex w-12 items-center justify-center text-gray-700 hover:text-blue-600"
                >
                  {showRegisterPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              <div className="flex h-12 overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-blue-600">
                <div className="flex w-12 items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-800">
                  <Phone size={20} />
                </div>

                <input
                  type="text"
                  value={registerData.phone}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Phone"
                  className="w-full px-4 text-gray-800 outline-none"
                  required
                />
              </div>

              <div className="flex h-12 overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-blue-600">
                <div className="flex w-12 items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-800">
                  <Building size={20} />
                </div>

                <input
                  type="text"
                  value={registerData.companyName}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      companyName: e.target.value,
                    })
                  }
                  placeholder="Company Name (Optional)"
                  className="w-full px-4 text-gray-800 outline-none"
                />
              </div>

              <div className="flex overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-blue-600">
                <div className="flex w-12 items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-800">
                  <MapPin size={20} />
                </div>

                <textarea
                  value={registerData.address}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      address: e.target.value,
                    })
                  }
                  placeholder="Address"
                  className="w-full px-4 py-3 text-gray-800 outline-none"
                  rows="2"
                />
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="flex h-12 w-full items-center justify-center rounded-md bg-blue-600 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {registerLoading ? "Registering..." : "Register as Customer"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-900">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </div>
          </>
        )}
      </Motion.div>
    </div>
  );
};

export default Login;
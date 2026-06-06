import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await API.post("/auth/forgot-password", {
        email,
      });

      toast.success(response.data.message || "Reset link generated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error requesting reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-sky-700 to-blue-900 px-4 py-8">
      <div className="w-full max-w-md rounded-[28px] bg-gradient-to-r from-white via-sky-200 to-blue-300 p-[3px] shadow-2xl">
        <div className="rounded-[25px] bg-white/95 p-6 sm:p-8">
          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-blue-950 hover:text-sky-700"
          >
            <ArrowLeft size={18} />
            Back to login
          </Link>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-950 text-white">
              <Mail size={30} />
            </div>

            <h1 className="text-3xl font-black text-blue-950">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-600">
              Enter your email address and we will generate a password reset
              link.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="mb-2 block font-bold text-blue-950">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your account email"
                required
                className="w-full rounded-2xl border-2 border-sky-200 bg-white px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-500 focus:border-blue-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-950 via-sky-700 to-blue-800 px-5 py-3 font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={18} />
              {loading ? "Generating..." : "Generate Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
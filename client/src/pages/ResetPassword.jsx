import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock, Save } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await API.put(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success(response.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
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
              <Lock size={30} />
            </div>

            <h1 className="text-3xl font-black text-blue-950">
              Reset Password
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-600">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="mb-2 block font-bold text-blue-950">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full rounded-2xl border-2 border-sky-200 bg-white px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-500 focus:border-blue-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-blue-950">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full rounded-2xl border-2 border-sky-200 bg-white px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-500 focus:border-blue-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-950 via-sky-700 to-blue-800 px-5 py-3 font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
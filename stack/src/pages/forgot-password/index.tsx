"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";
import { Main } from "next/document";

/* This is for forget password. When a user forget's their password they click on forgot password in login page (/auth) then this page will open then they enter their email or phone number, if it looks like email the app will know its an email or if its phone number app will know its phone number and click on reset password button then a password will be shown in a pop up message including upper and lower case alphabets then it will redirect to login page */

export default function ForgotPassword() {
  const [form, setForm] = useState({ identifier: "" });
  const router = useRouter();

  const handleForgot = async () => {
    const identifier = form.identifier.trim();
    const payload = identifier.includes("@")
      ? { email: identifier, phone: "" }
      : { email: "", phone: identifier };

    try {
      const res = await axiosInstance.post("/user/forgot-password", payload);
      toast.success("New Password: " + res.data.newPassword);
      router.replace("/auth");
    } catch (err: any) {
      console.log("Error response:", err.response?.data);
      // Show backend error if available
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
   
    <div className="min-h-screen flex items-center bg-gray-100 justify-center">
      <div className="bg-white text-black p-6 rounded shadow w-full max-w-md flex flex-col gap-4">
        <h2 className="text-xl text-center font-bold">Forgot Password</h2>

        <input
          name="identifier"
          placeholder="Enter Email or Phone Number"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
        />

        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleForgot}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

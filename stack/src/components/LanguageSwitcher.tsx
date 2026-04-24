import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";
import i18n from "@/lib/i18n";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

/* LanguageSwitcher component allows users to change the application language (English, French, Portuguese, Spanish, Hindi, Chinese) securely.
It supports multiple languages and enforces OTP verification before applying the change:
 - For French, OTP is sent via email.
 - For other languages, OTP is sent via phone using Firebase with reCAPTCHA protection.(Note: OTP SMS is not be received on phone as of now billing is not enabled. Test Number is used )
 Test Number are +919876543210 (123456)
                 +917303864683 (123456)
                 +919303897617 (123456)
 The component manages OTP input through a modal, verifies the code with the backend,
 and updates the active language in i18next while persisting the choice in localStorage.
 This ensures a seamless, multilingual experience with added security for language switching.
 */

// Fix TS window errors
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any;
  }
}

type Props = {
  userId: string;
  email?: string;
  phoneNumber?: string;
};

const LanguageSwitcher: React.FC<Props> = ({ userId, email, phoneNumber }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [otpUi, setOtpUi] = useState(false);
  const [phone, setPhone] = useState(phoneNumber || "");
  const [otp, setOtp] = useState("");
  const [selectLanguage, setSelectLanguage] = useState("");

  const languages = [
    { code: "en", label: "ENGLISH" },
    { code: "hi", label: "HINDI" },
    { code: "fr", label: "FRENCH" },
    { code: "es", label: "SPANISH" },
    { code: "pt", label: "PORTUGUESE" },
    { code: "zh", label: "CHINESE" },
  ];

  useEffect(() => {
  if (phoneNumber) {
    setPhone(phoneNumber);
    localStorage.setItem("phone", phoneNumber);
  } else {
    const saved = localStorage.getItem("phone");
    if (saved) setPhone(saved);
  }
}, [phoneNumber]);

  // Setup reCAPTCHA once
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }
  };
  const handleChange = async (lang: string) => {
  setSelectLanguage(lang);
  setOtpUi(true);

  try {
    if (lang === "fr") {
      if (!email) {
        toast.error("Email missing");
        return;
      }

      await axiosInstance.post("/api/request-language-otp", {
        userId,
        language: lang,
        email,
      });

      toast.success("OTP sent to email");
      setOtpUi(true); 

    } else {
      if (!phone) {
        toast.error("Phone number missing");
        return;
      }

      setupRecaptcha();
     
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmation;

      toast.success("OTP sent to phone");
      setOtpUi(true); 
    }

  } catch (err) {
    console.error(err);
    toast.error("Failed to send OTP");
  }
};

const handleVerify = async () => {
  try {
    if (selectLanguage === "fr") {
      await axiosInstance.post("/api/verify-language-otp", {
        userId,
        language: selectLanguage,
        otp,
      });
    } else {
      if (!window.confirmationResult) {
        toast.error("No confirmation result found");
        return;
      }
      await window.confirmationResult.confirm(otp);

      await axiosInstance.post("/api/verify-language-otp", {
        userId,
        language: selectLanguage,
        otp: "firebase",
      });
    }

    await i18n.changeLanguage(selectLanguage);
    localStorage.setItem("lang", selectLanguage);
    toast.success("Language changed!");

    setOtpUi(false);
    setOtp("");
  } catch (err) {
    console.error(err);
    toast.error("Invalid OTP");
  } finally {
    setLoading(false);
  }
};
   return (
    <>
      <select
        disabled={loading}
        onChange={(e) => handleChange(e.target.value)}
        className="border px-2 py-1 rounded text-sm"
      >
        <option value="">🌐 {t("language")}</option>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>

      {/* OTP */}
     {otpUi && (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50">
    <div className="bg-white rounded-lg shadow-xl w-96 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {loading ? "Sending OTP…" : "Verify OTP"}
      </h2>
      {!loading && (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500"
            maxLength={6}
            placeholder="••••••"
          />
          <button
            onClick={handleVerify}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4"
            disabled={loading}
          >
            Verify
          </button>
        </>
      )}
      <button
        onClick={() => setOtpUi(false)}
        className="w-full mt-2 text-gray-500"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      <div id="recaptcha-container"></div>
    </>
  );
};

export default LanguageSwitcher;
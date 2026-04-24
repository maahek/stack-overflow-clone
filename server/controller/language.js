import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const otpStore = new Map();
const languageStore = new Map();

const SUPPORTED_LANGUAGES = ["en", "es", "hi", "pt", "zh", "fr"];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const requestLanguageOTP = async (req, res) => {
  try {
    const { userId, language, email } = req.body;

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const otp = generateOTP();
    const key = `${userId}_${language}`;
    otpStore.set(key, { otp, expiry: Date.now() + 5 * 60 * 1000 });

    if (language === "fr") {
      if (!email) return res.status(400).json({ error: "Email required" });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Language Change OTP",
        html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 5 minutes</p>`,
      });

      return res.json({ method: "email", message: "Email OTP sent" });
    }

    // Other languages → frontend handles SMS via Firebase
    return res.json({ method: "phone", message: "Phone OTP expected" });
  } catch (err) {
    console.error("OTP ERROR:", err.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyLanguageOTP = (req, res) => {
  const { userId, language, otp } = req.body;

  if (otp === "firebase") {
    // SMS OTP already verified by Firebase SDK
    languageStore.set(userId, language);
    return res.json({ success: true, language });
  }

  // Email OTP verification
  const key = `${userId}_${language}`;
  const stored = otpStore.get(key);

  if (!stored || Date.now() > stored.expiry) {
    otpStore.delete(key);
    return res.status(400).json({ error: "OTP expired" });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  languageStore.set(userId, language);
  otpStore.delete(key);

  res.json({ success: true, language });
};



export const getUserLanguage = (req, res) => {
  const lang = languageStore.get(req.params.userId) || "en";
  res.json({ language: lang });
};

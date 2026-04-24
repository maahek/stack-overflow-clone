import express from "express";
import {
    requestLanguageOTP,
    verifyLanguageOTP,
    getUserLanguage,
} from "../controller/language.js";

const router = express.Router();

router.post("/request-language-otp", requestLanguageOTP); // route for requesting OTP for language change
router.post("/verify-language-otp", verifyLanguageOTP); // route for verifying OTP
router.get("/user-language/:userId", getUserLanguage); // route for getting user's language


export default router;
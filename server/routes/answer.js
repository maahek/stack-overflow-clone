import express from "express";
import {
  Askanswer,
  deleteanswer,
  upvoteAnswer,
  downvoteAnswer,
  transferPoints,   
} from "../controller/answer.js";

import auth from "../middleware/auth.js";

const router = express.Router();


router.post("/postanswer/:id",auth, Askanswer);
router.delete("/delete/:id", auth, deleteanswer);
router.patch("/upvote/:questionId/:answerId", auth, upvoteAnswer);
router.patch("/downvote/:questionId/:answerId", auth, downvoteAnswer);
router.post("/transfer", auth, transferPoints);


export default router;

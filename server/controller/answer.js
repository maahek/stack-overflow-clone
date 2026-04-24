import mongoose from "mongoose";
import question from "../models/question.js";
import user from "../models/auth.js";

// This is for adding Answer
export const Askanswer = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  const { noofanswer, answerbody, useranswered } = req.body;
  const userid = req.userId; 

  updatenoofanswer(_id, noofanswer);

  try {
    const updatequestion = await question.findByIdAndUpdate(
      _id,
      {
        $addToSet: {
          answer: [
            { answerbody, useranswered, userid, upvotes: [], downvotes: [] },
          ],
        },
      },
      { new: true },
    );
    await user.findByIdAndUpdate(userid, { $inc: { points: 5 } }); // This is for reward. 5 points for answering question 

    res.status(200).json({ data: updatequestion });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};

const updatenoofanswer = async (_id, noofanswer) => {
  try {
    await question.findByIdAndUpdate(_id, { $set: { noofanswer: noofanswer } });
  } catch (error) {
    console.log(error);
  }
};

export const deleteanswer = async (req, res) => {
  const { id: questionId } = req.params;
  const { noofanswer, answerid } = req.body;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ message: "Question unavailable" });
  }
  if (!mongoose.Types.ObjectId.isValid(answerid)) {
    return res.status(400).json({ message: "Answer unavailable" });
  }

  try {
    const q = await question.findById(questionId);
    if (!q) return res.status(404).json({ message: "Question not found" });

    const ans = q.answer.id(answerid);
    if (!ans) return res.status(404).json({ message: "Answer not found" });

    // Deduct 5 points from the user who posted the answer if they delete the answer
    if (ans.userid) {
      await user.findByIdAndUpdate(ans.userid, { $inc: { points: -5 } });
    }
    await question.updateOne(
      { _id: questionId },
      { $pull: { answer: { _id: answerid } } }
    );
    await question.findByIdAndUpdate(questionId, { $set: { noofanswer } });

    res.status(200).json({ message: "Answer deleted and 5 points deducted" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong..");
  }
};

export const upvoteAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;
  const userId = req.userId;

  try {
    const q = await question.findById(questionId);
    if (!q) return res.status(404).json({ message: "Question not found" });

    const ans = q.answer.id(answerId);
    if (!ans) return res.status(404).json({ message: "Answer not found" });

    if (!ans.upvotes.includes(userId)) {
      ans.upvotes.push(userId);

      //  Bonus: if answer reaches 5 upvotes, +5 points
      if (ans.upvotes.length === 5) {
        await user.findByIdAndUpdate(ans.userid, { $inc: { points: 5 } });
      }
    }

    await q.save();
    res.json(ans);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
};

// Downvote Answer
export const downvoteAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;
  const userId = req.userId;

  try {
    const q = await question.findById(questionId);
    if (!q) return res.status(404).json({ message: "Question not found" });

    const ans = q.answer.id(answerId);
    if (!ans) return res.status(404).json({ message: "Answer not found" });

    if (!ans.downvotes.includes(userId)) {
      ans.downvotes.push(userId);

      //  Deduct 1 point per downvote
      await user.findByIdAndUpdate(ans.userid, { $inc: { points: -1 } });
    }

    await q.save();
    res.json(ans);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
};

export const transferPoints = async (req, res) => {
  try {
    const { recipientId, amount } = req.body;
    const senderId = req.userId;

    const sender = await user.findById(senderId);
    // If recipientId is an email, find by email
    const recipient =
      (await user.findOne({ email: recipientId })) ||
      (await user.findById(recipientId));

    if (!sender || !recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.points <= 10) {
      return res
        .status(403)
        .json({ message: "You need more than 10 points to transfer" });
    }

    if (sender.points < amount) {
      return res.status(403).json({ message: "Not enough points" });
    }

    console.log("Sender before:", sender.points);
    console.log("Recipient before:", recipient.points);

    sender.points -= amount;
    recipient.points += amount;

    await sender.save();
    await recipient.save();

    console.log("Sender after:", sender.points);
    console.log("Recipient after:", recipient.points);

    res.json({ message: "Points transferred successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

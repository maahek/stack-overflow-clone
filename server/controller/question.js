import mongoose from "mongoose";
import question from "../models/question.js";


export const Askquestion = async (req, res) => {
  const { postquestiondata } = req.body;
  const userid = req.userid;
  const postques = new question({ ...postquestiondata, userid });
  try {
    await postques.save();
    res.status(200).json({ data: postques });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};

export const getallquestion = async (req, res) => {
  try {
    const allquestion = await question.find().sort({ askedon: -1 });
    res.status(200).json({ data: allquestion });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};

export const getquestionbyid = async (req, res) => {
  const { id: _id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  try {
    const questiondata = await question.findById(_id);
    if (!questiondata) {
      return res.status(404).json({ message: "question not found" });
    }
    res.status(200).json({ data: questiondata });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};

export const deletequestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  try {
    await question.findByIdAndDelete(_id);
    res.status(200).json({ message: "question deleted" });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const votequestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value, userid } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  try {
    const questionDoc = await question.findById(_id);
    const upindex = questionDoc.upvotes.findIndex((id) => id === String(userid));
    const downindex = questionDoc.downvotes.findIndex(
      (id) => id === String(userid)
    );
    if (value === "upvote") {
      if (downindex !== -1) {
        questionDoc.downvotes = questionDoc.downvotes.filter(
          (id) => id !== String(userid)
        );
      }
      if (upindex === -1) {
        questionDoc.upvotes.push(userid);
      } else {
        questionDoc.upvotes = questionDoc.upvotes.filter((id) => id !== String(userid));
      }
    } else if (value === "downvote") {
      if (upindex !== -1) {
        questionDoc.upvotes = questionDoc.upvotes.filter((id) => id !== String(userid));
      }
      if (downindex === -1) {
        questionDoc.downvotes.push(userid);
      } else {
        questionDoc.downvotes = questionDoc.downvotes.filter(
          (id) => id !== String(userid)
        );
      }
    }
    const questionvote = await question.findByIdAndUpdate(_id, questionDoc, { new: true });
    res.status(200).json({ data: questionvote });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};

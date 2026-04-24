import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
    },
    media: {
      type: String,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: [],
    },
    comments: {
      type: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          text: String,
        },
      ],
      default: [],
    },

    shares: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);

import Mainlayout from "@/layout/Mainlayout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosinstance";
import { Share, ThumbsUp, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

/* This component represents a social media–style public feed where users can view and interact with posts.
   On initial load, it fetches posts from the backend (/post) and stores them in state.
   Each post displays the users name, caption, and optional media (image or video).
   Users can engage with posts through three key actions: like, share (only share count will be increases onclick), and comment.
   The like and share handlers send PATCH requests to update counts, while the comment handler posts new text to the backend and refreshes the post state.
   The UI presents action buttons showing current counts, an input field for writing comments, and a list of existing comments.
   In short, this component is an an interactive feed where posts are dynamically updated based on user engagement. 
    */

type PostType = {
  _id: string;
  content: string;
  media?: string;
  author?: {
    name?: string;
  };
  likes?: any[];
  comments?: {
    _id?: string;
    text: string;
    user?: {
      name?: string;
    };
  }[];
  shares?: number;
};

export default function Feed() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [mounted, setMounted] = useState(false); // mounted to avoid hydration mismatches between server and client rendering.

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosInstance.get("/post");
        setPosts(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, []);

  if (!mounted) return null;
  // LIKE
  const handleLike = async (postId: string) => {
    try {
      const { data } = await axiosInstance.patch(`/post/like/${postId}`);
      setPosts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
    } catch (err) {
      console.log(err);
    }
  };

  // SHARE
  const handleShare = async (postId: string) => {
    try {
      const { data } = await axiosInstance.patch(`/post/share/${postId}`);
      setPosts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
    } catch (err) {
      console.log(err);
    }
  };

  // COMMENT
  const handleComment = async (postId: string) => {
    const text = comments[postId];
    if (!text) return;

    try {
      const { data } = await axiosInstance.post(`/post/comment/${postId}`, {
        text,
      });

      setPosts((prev) => prev.map((p) => (p._id === data._id ? data : p)));

      setComments({ ...comments, [postId]: "" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Mainlayout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t("publicFeed")}</h1>

        {posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded-lg shadow mb-4">
            {/* USER */}
            <h2 className="font-semibold text-gray-800 mb-1">
              {post.author?.name}
            </h2>

           
            <p className="text-gray-600 mb-3">{post.content}</p>

            {post.media &&
              typeof post.media === "string" &&
              (post.media.endsWith(".mp4") ? (
                <video
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${post.media}`}
                  controls
                  className="w-full rounded mb-2"
                />
              ) : (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${post.media}`}
                  className="w-full rounded mb-2"
                />
              ))}
            
            <div className="flex gap-4 text-sm mb-2">
              <Button
                onClick={() => handleLike(post._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                {post.likes?.length || 0} <ThumbsUp size={14} />
              </Button>

              <Button className="bg-blue-500 text-white px-3 py-1 rounded">
                {post.comments?.length || 0} <MessageCircle size={14} />
              </Button>

              <Button
                onClick={() => handleShare(post._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                {post.shares || 0} <Share size={14} />
              </Button>
            </div>

            {/* Comment input */}
            <div className="flex gap-2">
              <input
                value={comments[post._id] || ""}
                onChange={(e) =>
                  setComments({
                    ...comments,
                    [post._id]: e.target.value,
                  })
                }
                placeholder={t("writeComment")}
                className="flex-1 border p-2 rounded"
              />

              <Button
                onClick={() => handleComment(post._id)}
                className="bg-blue-600 text-white px-3 rounded"
              >
                {t("send")}
              </Button>
            </div>

            {/* Comment List */}
            <div className="mt-2 space-y-1">
              {post.comments?.map((c: any) => (
                <p key={c._id || Math.random()} className="text-sm">
                  <b>{c.user?.name}</b>: {c.text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Mainlayout>
  );
}

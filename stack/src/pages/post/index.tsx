import Mainlayout from "@/layout/Mainlayout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import router, { useRouter } from "next/router";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
// This code is for creating a post
export default function Post() {
  const { t } = useTranslation();
  const [Posts, setPosts] = useState<any[]>([]);
  const [posting, setposting] = useState(true);
  const [content, setcontent] = useState("");
  const [media, setmedia] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [video, setvideo] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
// To create a post, it is used when the user clicks on the create post button
  const handlePost = async () => {
  try {
    const formData = new FormData();

    formData.append("content", content);
    if (file) {
      formData.append("media", file);
    }

    await axiosInstance.post("/post/create-post", formData);

    router.replace("/feed");
  } catch (error: any) {
    toast.error(error.response?.data?.message || t("failedCreatePost"));
  }
};

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6 flex justify-center">
        <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">{t("createPost")}</h2>
          {/* To write caption for the post*/}
          <textarea
            value={content}
            onChange={(e) => setcontent(e.target.value)}
            placeholder={t("whatsOnYourMind")}
            className="w-full border p-2 rounded mb-3"
          />
          {/* To upload media for the post*/}
          <input
            type="file" 
            className="w-full border p-2 rounded mb-3"
            accept="image/*, video/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];

              if (selectedFile) {
                setFile(selectedFile); // Store the selected file

                const url = URL.createObjectURL(selectedFile);
                setmedia(url); 

                if (selectedFile.type.startsWith("video/")) { // if it is a video show video player else it will show image
                  setvideo(true);
                } else {
                  setvideo(false);
                }
              }
            }}
          />
          {media &&
            (video ? (
              <video
                src={media}
                controls
                className="w-full h-60 rounded-md mb-3"
              />
            ) : (
              <img
                src={media}
                alt="post"
                className="w-full h-60 object-cover rounded-md mb-3"
              />
            ))}

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setposting(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handlePost}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t("post")}
            </Button>
          </div>
        </div>
        {Posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold">{post.author?.name}</h3>
            <p className="mb-2">{post.content}</p>
            {post.media && (
              <img src={post.media} className="w-full rounded mb-2" />
            )}
          </div>
        ))}
      </main>
    </Mainlayout>
  );
}

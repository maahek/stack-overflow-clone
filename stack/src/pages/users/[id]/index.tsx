import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Mainlayout from "@/layout/Mainlayout";
import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { Calendar, Edit, Plus, X } from "lucide-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PointTransfer from "@/components/point-transfer";
import { useTranslation } from "react-i18next";

const getUserData = (id: string) => {
  const user = {
   /* "1": {
      id: 1,
      name: "John Doe",
      joinDate: "2019-03-15",
      about:
        "Full-stack developer with 8+ years of experience in JavaScript, React, and Node.js. Passionate about clean code and helping others learn programming. I enjoy working on open-source projects and contributing to the developer community.",
      tags: [
        "javascript",
        "react",
        "node.js",
        "typescript",
        "python",
        "mongodb",
      ],
    },
  };
  return user[id as keyof typeof user] || user["1"];*/
  };
  return null;
};
const index = ({ userData }: { userData: any }) => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [users, setusers] = useState<any>(userData);
  const [points, setPoints] = useState<number>(0);
  const [loading, setloading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setisFollowing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: users?.name || "",
    about: users?.about || "",
    tags: users?.tags || [],
    phoneNumber: users?.phoneNumber || "",
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (userData) {
      setusers(userData);

      setEditForm({
        name: userData.name || "",
        about: userData.about || "",
        tags: userData.tags || [],
        phoneNumber: userData.phoneNumber || "",
      });
    }
  }, [userData]);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const res = await axiosInstance.get("/user/getalluser");
        const matcheduser = res.data.data.find((u: any) => u._id === id);
        setusers(matcheduser);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
        toast.success(t("userDataFetched"));
      }
    };
    fetchuser();
  }, [id]);
// For fetching points
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const { data } = await axiosInstance.get("/user/profile");
        console.log("Fetched data:", data);
        setPoints(data.points);
      } catch (err: any) {
        console.error(
          "Error fetching points:",
          err.response?.data || err.message,
        );
      } finally {
        setloading(false);
      }
    };

    fetchPoints();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchProfile();
    }
  }, [id]);
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get(`/user/${id}`);
      if (res.status !== 200) throw new Error("API error");
      const { data } = res;
      console.log("PROFILE:", data);

      setFollowers(data.followers);
      setFollowing(data.following);
      setisFollowing(data.isFollowing);
      setPoints(data.points);
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  if (!mounted) return null;
  if (loading) {
    return (
      <Mainlayout>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </Mainlayout>
    );
  }
  if (!users || users.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">{t("noUserFound")}</div>
    );
  }

  const handleFollow = async () => {
    try {
      const response = await axiosInstance.patch(`/user/follow/${id}`);
      const { data } = response;

      console.log("DATA:", data);

      setFollowers(data.followers);
      setisFollowing(data.isFollowing);
    } catch (error) {
      console.log("ERROR:", error);
    }
  };
  const handleSaveProfile = async () => {
    try {
      const res = await axiosInstance.patch(`/user/update/${users?._id}`, {
        editForm,
      });
      if (res.data.data) {
        const updatedUser = {
          ...users,
          name: editForm.name,
          about: editForm.about,
          tags: editForm.tags,
          phoneNumber: editForm.phoneNumber,
        };

        setusers(updatedUser);
        setIsEditing(false);
        toast.success(t("profileUpdated"));
      }
    } catch (error) {
      console.log(error);
      toast.error(t("updateFailed"));
    }
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !editForm.tags.includes(trimmedTag)) {
      setEditForm({ ...editForm, tags: [...editForm.tags, trimmedTag] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditForm({
      ...editForm,
      tags: editForm.tags.filter((tag: any) => tag !== tagToRemove),
    });
  };

  const currentUserid = user?._id;
  const isOwnProfile = users?._id === currentUserid;

  return (
    <Mainlayout>
      <div className="max-w-6xl">
        {/* User Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8">
          <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
            <AvatarFallback className="text-2xl lg:text-3xl">
              {users?.name
                ?.split(" ")
                .map((n: any) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                  {users?.name || t("loading")}
                </h1>
              </div>
              {/* This is for following and followers, for posting logic */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={async () => {
                    try {
                      const response = await axiosInstance.patch(
                        `/user/follow/${id}`,
                      );
                      const { data } = response;

                      setFollowers(data.followers);
                      setFollowing(data.following);
                      setisFollowing(data.isFollowing);
                    } catch (err) {
                      console.log("ERROR:", err);
                    }
                  }}
                  className={`px-4 py-2 rounded text-white ${
                    isFollowing ? "bg-gray-500" : "bg-blue-600"
                  }`}
                >
                  {isFollowing ? t("unfollow") : t("follow")}
                </button>

                {/* Show following count */}
                <span className="text-sm text-gray-600">
                  {following} {t("following")}
                </span>

                {/* Show followers count */}
                <span className="text-sm text-gray-600">
                  {followers} {t("followers")}
                </span>
              </div>

              {isOwnProfile && (
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Edit className="w-4 h-4" />
                      {t("editProfile")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">
                    <DialogHeader>
                      <DialogTitle>{t("editProfile")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          {t("basicInformation")}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">{t("displayName")}</Label>
                            <Input
                              id="name"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                              placeholder={t("displayNamePlaceholder")}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        {/* Phone Number Section, So that phone number can be edited */}
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          value={editForm.phoneNumber}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              phoneNumber: e.target.value,
                            })
                          }
                          placeholder="+91XXXXXXXXXX"
                        />
                      </div>
                      {/* About Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{t("about")}</h3>
                        <div>
                          <Label htmlFor="about">{t("aboutMe")}</Label>
                          <Textarea
                            id="about"
                            value={editForm.about}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                about: e.target.value,
                              })
                            }
                            placeholder={t("aboutPlaceholder")}
                            className="min-h-32"
                          />
                        </div>
                      </div>

                      {/* Tags/Skills Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          {t("skillsTechnologies")}
                        </h3>

                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder={t("addSkillPlaceholder")}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleAddTag()
                              }
                            />
                            <Button
                              onClick={handleAddTag}
                              variant="outline"
                              size="sm"
                              className="bg-orange-600 text-white"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {(editForm.tags || []).map((tag: any) => {
                              return (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-orange-100 text-orange-800 flex items-center gap-1"
                                >
                                  {tag}
                                  <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-1 hover:text-red-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="bg-white text-gray-800 hover:text-gray-900"
                        >
                          {t("cancel")}
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {t("saveChanges")}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {t("memberSince")}{" "}
                {users?.createdAt
                  ? new Date(users.createdAt).toISOString().split("T")[0]
                  : "N/A"}
              </div>
            </div>
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="font-semibold">5</span>
                <span className="text-gray-600 ml-1">{t("goldBadges")}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="font-semibold">23</span>
                <span className="text-gray-600 ml-1">{t("silverBadges")}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-600 rounded-full mr-2"></div>
                <span className="font-semibold">45</span>
                <span className="text-gray-600 ml-1">{t("bronzeBadges")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <p>{t("loadingPoints")}</p>
      ) : (
        <p className="text-lg text-gray-800 mb-4">
          {t("currentPoints")}: <span className="font-semibold">{points}</span>
        </p>
      )}
      <PointTransfer />
      <div className="grid grid-cols-1  gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("about")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {users?.about}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("topTags")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(users?.tags || []).map((tag: string) => (
                  <div key={tag} className="flex items-center justify-between">
                    <div>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Mainlayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string | undefined;
  const userData = id ? getUserData(id) : null;

  return {
    props: {
      userData,
    },
  };
};

export default index;

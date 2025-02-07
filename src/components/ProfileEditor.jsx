"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ImageCropModal from "./ImageCropModal";

export default function ProfileEditor({ session }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session.user.name || "",
    username: session.user.username || "",
    description: session.user.description || "",
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageUrl(reader.result);
      setShowCropModal(true);
    };
  };

  const handleCropComplete = async (blob) => {
    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1];

        const res = await fetch("/api/profile/avatar", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: "cropped-avatar.jpg",
            contentType: "image/jpeg",
            base64: base64Data,
          }),
        });

        if (!res.ok) throw new Error("Failed to update avatar");

        toast.success("Avatar updated successfully");
        router.refresh();
      };
    } catch (error) {
      toast.error("Failed to update avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          Object.values(data.errors).forEach(error => toast.error(error));
        } else {
          toast.error(data.message || "Failed to update profile");
        }
        return;
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while updating profile");
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
            <div 
              className="w-32 h-32 rounded-full overflow-hidden bg-base-200 cursor-pointer relative group"
              onClick={handleAvatarClick}
            >
              {session.user.avatar?.base64 ? (
                <>
                  <div className="relative w-full h-full">
                    <Image
                      src={`data:${session.user.avatar.contentType};base64,${session.user.avatar.base64}`}
                      alt={session.user.name || "Profile"}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm">Change Avatar</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-base-300 group-hover:bg-base-200 transition-colors">
                  <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-400" />
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <div className="text-center">
              <h2 className="text-xl font-bold">{session.user.name}</h2>
              <p className="text-sm text-gray-500">@{session.user.username}</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input input-bordered bg-base-200"
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`input input-bordered bg-base-200 ${
                    errors.username ? "input-error" : ""
                  }`}
                  disabled={!isEditing}
                  required
                />
                {errors.username && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.username}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea textarea-bordered bg-base-200"
                  disabled={!isEditing}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: session.user.name || "",
                          username: session.user.username || "",
                          description: session.user.description || "",
                        });
                        setErrors({});
                      }}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          setImageUrl(null);
        }}
        imageUrl={imageUrl}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}

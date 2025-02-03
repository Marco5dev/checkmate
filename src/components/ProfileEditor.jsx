"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPen,
  faCheck,
  faXmark,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import ConnectedAccounts from "./ConnectedAccounts";
import PasswordModal from "./PasswordModal";
import ImageCropModal from "./ImageCropModal";

const ProfileEditor = ({ session }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({ email: '', username: '' });
  const [formData, setFormData] = useState({
    name: session.user.name,
    email: session.user.email,
    username: session.user.username || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Username validation
    if (name === 'username') {
      const regex = /^[a-z0-9_]+$/;
      if (!regex.test(value)) {
        toast.error("Username can only contain lowercase letters, numbers, and underscores");
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // Handle duplicate key errors
          setErrors(data.errors);
          toast.error("Email or username already in use");
          return;
        }
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setHasChanges(false);
      setIsEditing(false);
      setErrors({ email: '', username: '' });
      
      // Force session update
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
      
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleRevert = () => {
    setFormData({
      name: session.user.name,
      email: session.user.email,
      username: session.user.username || "",
    });
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleDisconnect = async (platform) => {
    try {
      const response = await fetch(`/api/auth/disconnect/${platform}`, {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to disconnect");
      
      toast.success(`Disconnected from ${platform}`);
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setCropModalOpen(true);
  };

  const handleCropComplete = async (croppedBlob) => {
    try {
      const base64 = await convertToBase64(croppedBlob);
      const response = await fetch('/api/profile/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar: {
            filename: 'profile-avatar.jpg',
            contentType: 'image/jpeg',
            base64: base64.split(',')[1],
            createdAt: new Date(),
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to update avatar');
      
      toast.success('Avatar updated successfully');
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'Failed to update avatar');
    } finally {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <div className="w-full flex lg:flex-row flex-col items-start">
        <div className="w-2/6">
          {/* Profile Image Section */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 relative group">
              {session?.user?.avatar?.base64 ? (
                <Image
                  src={`data:${session.user.avatar.contentType};base64,${session.user.avatar.base64}`}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full"
                />
              ) : (
                <div className="bg-gray-300 w-32 h-32 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-600 text-4xl" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-primary text-primary-content rounded-full btn btn-primary btn-circle cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity duration-200">
                <FontAwesomeIcon icon={faCamera} className="w-4 h-4" /> 
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          {/* Connected Accounts Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
            <ConnectedAccounts
              user={session.user}
              onDisconnect={handleDisconnect}
            />
          </div>
        </div>

        <div className="divider lg:divider-horizontal"></div>

        <div className="w-4/6">
          {/* Profile Info Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-ghost btn-sm"
              >
                <FontAwesomeIcon icon={isEditing ? faXmark : faPen} />
                {isEditing ? " Cancel" : " Edit"}
              </button>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input input-bordered"
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
                {errors.email && <span className="text-error text-sm mt-1">{errors.email}</span>}
              </div>

              {/* Username Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                  <span className="label-text-alt text-xs opacity-70">
                    Lowercase letters, numbers, and underscores only
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`input input-bordered ${errors.username ? 'input-error' : ''}`}
                  required
                  pattern="^[a-z0-9_]+$"
                  minLength={3}
                  maxLength={20}
                />
                {errors.username && <span className="text-error text-sm mt-1">{errors.username}</span>}
              </div>

              {/* Password Change Section */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="btn btn-outline btn-sm w-40"
                >
                  {session.user.password_changes > 0 ? "Change Password" : "Set Password"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Changes Bar */}
        {hasChanges && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-content p-4 rounded-lg shadow-lg flex gap-4 items-center">
            <span>You have unsaved changes</span>
            <button onClick={handleSave} className="btn btn-sm btn-ghost">
              <FontAwesomeIcon icon={faCheck} /> Save
            </button>
            <button onClick={handleRevert} className="btn btn-sm btn-ghost">
              <FontAwesomeIcon icon={faXmark} /> Revert
            </button>
          </div>
        )}
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        password_changes={session.user.password_changes}  // Change this line
      />

      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => {
          setCropModalOpen(false);
          setSelectedImage(null);
        }}
        imageUrl={selectedImage}
        onCropComplete={handleCropComplete}
      />
    </>
  );
};

export default ProfileEditor;

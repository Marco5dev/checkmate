"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const PasswordModal = ({ isOpen, onClose, password_changes }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const evaluatePasswordStrength = (password) => {
    let score = 0;

    if (!password) return "";

    // Check password length
    if (password.length > 8) score += 1;
    // Contains lowercase
    if (/[a-z]/.test(password)) score += 1;
    // Contains uppercase
    if (/[A-Z]/.test(password)) score += 1;
    // Contains numbers
    if (/\d/.test(password)) score += 1;
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
      case 2:
        return "Weak";
      case 3:
        return "Medium";
      case 4:
      case 5:
        return "Strong";
    }
  };

  const handlePasswordChange = (e, type) => {
    const value = e.target.value;
    if (type === 'new') {
      setStrength(evaluatePasswordStrength(value));
    }
    setFormData(prev => ({
      ...prev,
      [type === 'old' ? 'oldPassword' : type === 'new' ? 'newPassword' : 'confirmPassword']: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (strength === "Weak") {
      toast.error("Please choose a stronger password");
      return;
    }

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: password_changes > 0 ? formData.oldPassword : undefined,
          newPassword: formData.newPassword,
          isInitialSet: password_changes === 0
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success(password_changes > 0 ? "Password updated" : "Password set successfully");
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordField = (type, label, isRequired = true) => (
    <div className="form-control relative">
      <label className="label">
        <span className="label-text">{label}</span>
        {type === 'new' && (
          <span className={`label-text-alt ${
            strength === "Weak" ? "text-error" :
            strength === "Medium" ? "text-warning" :
            strength === "Strong" ? "text-success" : ""
          }`}>
            {strength || "No password"}
          </span>
        )}
      </label>
      <input
        type={showPassword[type] ? "text" : "password"}
        value={formData[type === 'old' ? 'oldPassword' : type === 'new' ? 'newPassword' : 'confirmPassword']}
        onChange={(e) => handlePasswordChange(e, type)}
        className={`input input-bordered pr-10 ${
          type === 'new' && strength && `input-${
            strength === "Weak" ? "error" :
            strength === "Medium" ? "warning" :
            strength === "Strong" ? "success" : ""
          }`
        }`}
        required={isRequired}
        minLength={8}
      />
      <button
        type="button"
        onClick={() => setShowPassword({ ...showPassword, [type]: !showPassword[type] })}
        className="absolute right-3 top-[43px]"
      >
        <FontAwesomeIcon
          icon={showPassword[type] ? faEyeSlash : faEye}
          className="text-gray-500"
        />
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-300 rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">
          {password_changes > 0 ? "Change Password" : "Set Password"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {password_changes > 0 && renderPasswordField('old', 'Current Password')}
          {renderPasswordField('new', 'New Password')}
          {renderPasswordField('confirm', 'Confirm New Password')}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : password_changes > 0 ? (
                "Update Password"
              ) : (
                "Set Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;

"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import apiService from "@/services/apiService";
import { useAppStore } from "@/store/useAppStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const allowedAvatarTypes = ["image/jpeg", "image/png", "image/webp"];
const maxAvatarSize = 10 * 1024 * 1024;

const getApiErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err) && err.response?.data) {
    const data = err.response.data as Record<string, unknown>;
    const messages = Object.values(data)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value): value is string => typeof value === "string");

    return messages[0] ?? "An unexpected error occurred.";
  }

  return "An unexpected error occurred.";
};

export default function ProfileForm() {
  const { user, isLoading: userLoading, error: userError } = useCurrentUser();
  const updateProfile = useAppStore((state) => state.updateProfile);
  const updateEmail = useAppStore((state) => state.updateEmail);

  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    level: "",
    department: "",
  });
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setFormState({
      first_name: user.profile.first_name,
      last_name: user.profile.last_name,
      email: user.email,
      level: user.profile.level,
      department: user.profile.department ?? "",
    });

    setAvatarPreview(user.profile.avatar ?? user.profile.avatar_url ?? null);
  }, [user]);

  const initials = useMemo(() => {
    const names = user?.name?.split(" ").filter(Boolean) ?? [];
    return names.length > 0
      ? names.map((n) => n[0].toUpperCase()).slice(0, 2).join("")
      : "U";
  }, [user]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!allowedAvatarTypes.includes(file.type)) {
      setErrorMessage("Only JPG, PNG, and WebP images are allowed.");
      return;
    }

    if (file.size > maxAvatarSize) {
      setErrorMessage("Avatar must be under 10 MB.");
      return;
    }

    setErrorMessage(null);
    setSelectedAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const profilePayload = {
        first_name: formState.first_name,
        last_name: formState.last_name,
        level: formState.level,
        department: formState.department || null,
        avatar: selectedAvatarFile ?? undefined,
      };

      const updatedProfile = await apiService.user.profile
        .update(profilePayload)
        .then((res) => res.data);

      updateProfile(updatedProfile);

      if (formState.email !== user.email) {
        const updatedUser = await apiService.user.updateEmail({ email: formState.email });
        updateEmail(updatedUser.data.email);
      }

      setSuccessMessage("Profile updated successfully.");
      setEditing(false);
      setSelectedAvatarFile(null);
      setAvatarPreview(updatedProfile.avatar ?? updatedProfile.avatar_url ?? null);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const avatarSrc = avatarPreview;

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div className="bg-white flex flex-col gap-4 rounded-xl">
        <div className="w-full h-24 rounded-t-xl bg-gradient-to-r from-[#0f173e] to-[#1a2456]" />

        <div className="flex items-center justify-between p-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => document.getElementById("avatar-input")?.click()}
              className="relative rounded-full overflow-hidden w-24 h-24 bg-gray-100 flex items-center justify-center"
              disabled={!editing}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name ?? "Profile avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-gray-700">{initials}</span>
              )}
              {editing && (
                <span className="absolute inset-x-0 bottom-0 py-1 text-[0.65rem] uppercase tracking-[0.15em] bg-black/40 text-white text-center">
                  Upload
                </span>
              )}
            </button>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.name ?? "User"}</h2>
              <p className="text-sm text-gray-500">{user?.email ?? ""}</p>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setEditing((prev) => !prev)}
              className="bg-[#0f173e] hover:bg-[#1a2456] text-white cursor-pointer py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        <input
          id="avatar-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={!editing}
        />

        <div className="px-8">
          {userError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {userError}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 px-8">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 py-2 px-8 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={formState.first_name}
              disabled={!editing || userLoading}
              onChange={(event) => setFormState((prev) => ({ ...prev, first_name: event.target.value }))}
              className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${
                editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={formState.last_name}
              disabled={!editing || userLoading}
              onChange={(event) => setFormState((prev) => ({ ...prev, last_name: event.target.value }))}
              className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${
                editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formState.email}
              disabled={!editing || userLoading}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${
                editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Student ID</label>
            <p className="rounded-md border border-gray-300 bg-gray-100 py-2 px-4 text-sm text-gray-700">
              {user?.profile?.identification_number ?? "—"}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 px-8">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 py-2 px-8 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Faculty</label>
            <input
              type="text"
              value={user?.profile?.department ?? ""}
              disabled={true}
              className="border border-gray-300 rounded-md py-2 px-4 bg-gray-100 cursor-not-allowed focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={formState.department}
              disabled={!editing || userLoading}
              onChange={(event) => setFormState((prev) => ({ ...prev, department: event.target.value }))}
              className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${
                editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Academic Level</label>
            <input
              type="text"
              value={formState.level}
              disabled={!editing || userLoading}
              onChange={(event) => setFormState((prev) => ({ ...prev, level: event.target.value }))}
              className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${
                editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select
              disabled={!editing || userLoading}
              className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${
                editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="flex justify-start py-4 px-8">
          <button
            type="button"
            disabled={!editing || isSaving || userLoading}
            onClick={handleSave}
            className={`bg-[#0f173e] text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              editing && !isSaving ? "hover:bg-[#1a2456]" : "opacity-60 cursor-not-allowed"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

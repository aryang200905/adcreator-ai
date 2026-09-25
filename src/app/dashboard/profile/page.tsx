/* eslint-disable @next/next/no-img-element */
"use client";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import { auth, storage } from "../../../lib/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { fileToCompressedDataURL } from "../../../lib/image";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(user?.displayName || "");
    setPhoto(user?.photoURL || null);
  }, [user]);

  const dirty =
    name.trim() !== (user?.displayName || "") || photo !== (user?.photoURL || null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      setError("Please choose an image under 800KB.");
      return;
    }
    try {
      setError("");
      setUploading(true);
      // Store the compressed file in Storage; Auth holds only its HTTPS URL.
      const data = await fileToCompressedDataURL(file, 160, 0.72);
      setPhoto(data);
      setSaved(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load that image.");
    } finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const handleSave = async () => {
    if (!auth.currentUser || uploading || !name.trim()) return;
    setSaving(true);
    setError("");
    try {
      let photoURL = photo;
      if (photo?.startsWith("data:")) {
        const photoRef = ref(storage, `users/${auth.currentUser.uid}/avatar.jpg`);
        await uploadString(photoRef, photo, "data_url", { contentType: "image/jpeg" });
        photoURL = await getDownloadURL(photoRef);
      }
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
        photoURL: photoURL ?? "",
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const e = err as { code?: string };
      setError(
        e.code?.startsWith("storage/")
          ? "Photo upload failed. Check your connection; the site owner must enable Firebase Storage and its upload rules."
          : e.code === "auth/invalid-profile-attribute"
          ? "That image is too large to save. Try a smaller one."
          : "Could not save changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const initial =
    user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U";

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your name and profile photo.</p>
      </div>

      <div className="max-w-2xl bg-card/40 border border-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-md">
        <h2 className="text-xl font-bold mb-6">Profile Information</h2>

        <div className="flex items-center gap-6 mb-8">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-primary/50 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-3xl border-2 border-primary/50 uppercase">
              {initial}
            </div>
          )}
          <div>
            <button
              disabled={saving || uploading}
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-sm font-medium transition-colors mb-2"
            >
              {uploading ? "Preparing photo…" : "Change Photo"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              onChange={handlePhoto}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K.</p>
            {photo && (
              <button
                onClick={() => {
                  setPhoto(null);
                  setSaved(false);
                }}
                className="text-xs text-red-500 hover:underline mt-1"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Full Name
            </label>
            <input
              type="text"
              maxLength={80}
              disabled={saving}
              aria-label="Full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
              placeholder="Your name"
              className="w-full h-11 bg-input/60 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full h-11 bg-foreground/5 border border-border/50 rounded-xl px-4 text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-500 font-medium">{error}</p>}

        <div className="mt-8 flex justify-end items-center gap-3">
          {saved && (
            <span className="text-sm text-emerald-500 font-medium flex items-center gap-1.5">
              <Check size={16} /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!dirty || saving || uploading || !name.trim()}
            className="h-11 px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

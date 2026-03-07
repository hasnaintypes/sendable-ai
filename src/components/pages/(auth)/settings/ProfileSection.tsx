"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

export function ProfileSection() {
  const user = useQuery(api.auth.queries.getCurrentUser);
  const preferences = useQuery(api.userPreferences.queries.get);
  const upsertPreferences = useMutation(api.userPreferences.mutations.upsert);
  const generateUploadUrl = useMutation(
    api.userPreferences.upload.generateUploadUrl,
  );
  const saveProfileImage = useMutation(
    api.userPreferences.upload.saveProfileImage,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      setFirstName(preferences?.firstName ?? nameParts[0] ?? "");
      setLastName(preferences?.lastName ?? nameParts.slice(1).join(" ") ?? "");
      setEmail(user.email || "");
    }
    if (preferences) {
      setPhone(preferences.phone ?? "");
      setCompany(preferences.company ?? "");
      setJobTitle(preferences.jobTitle ?? "");
    }
  }, [user, preferences]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await upsertPreferences({
        firstName,
        lastName,
        phone,
        company,
        jobTitle,
      });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      setFirstName(preferences?.firstName ?? nameParts[0] ?? "");
      setLastName(preferences?.lastName ?? nameParts.slice(1).join(" ") ?? "");
      setEmail(user.email || "");
    }
    if (preferences) {
      setPhone(preferences.phone ?? "");
      setCompany(preferences.company ?? "");
      setJobTitle(preferences.jobTitle ?? "");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large. Max 2MB.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      toast.error("Only JPG, PNG, and GIF files are allowed.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      await saveProfileImage({ storageId });
      toast.success("Profile photo updated");
    } catch {
      toast.error("Failed to upload photo");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const profileImageUrl =
    previewUrl || preferences?.profileImage || user?.image || "";

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>
            This will be displayed on your account
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {uploading ? "Uploading..." : "Upload photo"}
            </Button>

            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal contact information
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="opacity-60"
            />
            <p className="text-xs text-muted-foreground">
              Email changes are managed in the Security tab.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Mobile number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+92 300 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Information</CardTitle>
          <CardDescription>Details about your organization</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job title</Label>
            <Input
              id="jobTitle"
              placeholder="Sales Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>

        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </div>
  );
}

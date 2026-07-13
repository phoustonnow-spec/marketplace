"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AvatarUpload({
  userId,
  initial,
}: {
  userId: string;
  initial?: string | null;
}) {
  const [url, setUrl] = useState(initial || "");
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/avatar-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("photos")
      .upload(path, file, { upsert: false });
    if (!error) {
      const { data } = supabase.storage.from("photos").getPublicUrl(path);
      setUrl(data.publicUrl);
    }
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div>
      <input type="hidden" name="avatar_url" value={url} />
      <div className="flex items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-16 w-16 rounded-full border border-line object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full border border-line bg-sand" />
        )}
        <label className="btn-ghost cursor-pointer">
          {url ? "Change photo" : "Upload photo"}
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-xs text-red-600"
          >
            Remove
          </button>
        )}
      </div>
      {uploading && <p className="mt-1 text-xs text-[#8a8071]">Uploading…</p>}
    </div>
  );
}

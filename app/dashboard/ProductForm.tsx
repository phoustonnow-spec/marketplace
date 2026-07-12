"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { addProduct } from "./actions";

type ChannelOpt = { id: string; name: string; masterName: string };

export default function ProductForm({
  channels,
  userId,
}: {
  channels: ChannelOpt[];
  userId: string;
}) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("photos").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (!error) {
        const { data } = supabase.storage.from("photos").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    setPhotos((p) => [...p, ...urls]);
    setUploading(false);
    e.target.value = "";
  }

  if (!open) {
    return (
      <button className="btn" onClick={() => setOpen(true)}>
        + Add item
      </button>
    );
  }

  return (
    <form
      action={async (fd) => {
        fd.set("photos", JSON.stringify(photos));
        await addProduct(fd);
        setPhotos([]);
        setOpen(false);
      }}
      className="card mt-4 p-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-semibold">Add item</h3>
        <button type="button" className="text-[#8a8071]" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>

      <label className="label">Photos</label>
      <input type="file" accept="image/*" multiple onChange={handleFiles} />
      {uploading && <p className="mt-1 text-sm text-[#8a8071]">Uploading…</p>}
      {photos.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {photos.map((u, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={u}
              alt=""
              className="h-16 w-16 rounded-md object-cover"
            />
          ))}
        </div>
      )}

      <label className="label">Item name</label>
      <input name="name" className="input" placeholder="e.g. Neverfull MM Monogram" />

      <label className="label">Category → channel</label>
      <select name="channel_id" className="input">
        <option value="">— none —</option>
        {channels.map((c) => (
          <option key={c.id} value={c.id}>
            {c.masterName} · {c.name}
          </option>
        ))}
      </select>

      <label className="label">Price (USD)</label>
      <input name="price" type="number" min="0" step="1" className="input" placeholder="0" />

      <label className="label">Description</label>
      <textarea
        name="description"
        className="input min-h-[90px]"
        placeholder="Condition, size, what's included…"
      />

      <button className="btn mt-4 w-full py-2" disabled={uploading}>
        Add to inventory
      </button>
    </form>
  );
}

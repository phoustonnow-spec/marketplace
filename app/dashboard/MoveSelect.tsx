"use client";

import { moveProduct } from "./actions";

type ChannelOpt = { id: string; name: string; masterName: string };

// A small dropdown that moves an item to another brand the moment you pick one.
export default function MoveSelect({
  productId,
  currentChannelId,
  channels,
}: {
  productId: string;
  currentChannelId: string | null;
  channels: ChannelOpt[];
}) {
  return (
    <form action={moveProduct}>
      <input type="hidden" name="id" value={productId} />
      <select
        name="channel_id"
        defaultValue={currentChannelId || ""}
        className="input !py-1 !text-xs"
        aria-label="Move to designer"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        <option value="">— no designer —</option>
        {channels.map((c) => (
          <option key={c.id} value={c.id}>
            Move to: {c.masterName} · {c.name}
          </option>
        ))}
      </select>
    </form>
  );
}

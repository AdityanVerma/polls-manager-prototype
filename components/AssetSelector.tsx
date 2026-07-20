"use client";

import { useState } from "react";
import Badge from "@/components/Badge";
import type { Asset } from "@/types/poll";

interface AssetSelectorProps {
  assets: Asset[];
  selectedAssetId: string | null;
  onSelect: (asset: Asset) => void;
}

export default function AssetSelector({
  assets,
  selectedAssetId,
  onSelect,
}: AssetSelectorProps) {
  const [query, setQuery] = useState("");

  const filteredAssets = assets.filter((asset) =>
    asset.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700">
        Search Assets
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
          className="w-full rounded-lg border border-zinc-300 py-2.5 pr-3 pl-9 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
        />
      </div>

      <div className="mt-3 max-h-96 space-y-2 overflow-y-auto pr-1">
        {filteredAssets.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No assets match your search.
          </p>
        ) : (
          filteredAssets.map((asset) => {
            const isSelected = asset.id === selectedAssetId;
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => onSelect(asset)}
                aria-pressed={isSelected}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-900/5"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-900">
                    {asset.title}
                  </p>
                  <Badge color="sky">{asset.assetType}</Badge>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {asset.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs text-zinc-500">
                  {asset.description}
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

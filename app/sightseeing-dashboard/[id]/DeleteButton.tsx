"use client";

import { deleteSightseeing } from "../actions";
import { Trash2 } from "lucide-react";

export function DeleteButton({ id }: { id: number }) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "⚠️ DANGER: Are you sure you want to delete this record? This action cannot be undone."
    );

    if (confirmed) {
      await deleteSightseeing(id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white px-6 py-4 rounded-full border border-red-500/20 transition-all flex items-center gap-2"
    >
      <Trash2 size={14} />
      Delete Record
    </button>
  );
}
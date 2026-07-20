"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Poll } from "@/types/poll";

interface PollStoreContextValue {
  polls: Poll[];
  savePoll: (poll: Poll) => void;
}

const PollStoreContext = createContext<PollStoreContextValue | undefined>(
  undefined,
);

export function PollStoreProvider({ children }: { children: ReactNode }) {
  const [polls, setPolls] = useState<Poll[]>([]);

  const savePoll = (poll: Poll) => {
    setPolls((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === poll.id);
      if (existingIndex === -1) {
        return [...prev, poll];
      }
      const updated = [...prev];
      updated[existingIndex] = poll;
      return updated;
    });
  };

  return (
    <PollStoreContext.Provider value={{ polls, savePoll }}>
      {children}
    </PollStoreContext.Provider>
  );
}

export function usePollStore(): PollStoreContextValue {
  const context = useContext(PollStoreContext);
  if (!context) {
    throw new Error("usePollStore must be used within a PollStoreProvider.");
  }
  return context;
}

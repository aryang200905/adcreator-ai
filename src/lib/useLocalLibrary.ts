"use client";
import { useMemo, useSyncExternalStore } from "react";
import type { LibraryItem } from "./templates";

export function useLocalLibrary(key: string) {
  const raw = useSyncExternalStore(
    (listener) => {
      window.addEventListener("storage", listener);
      window.addEventListener("librarychange", listener);
      return () => {
        window.removeEventListener("storage", listener);
        window.removeEventListener("librarychange", listener);
      };
    },
    () => { try { return localStorage.getItem(key); } catch { return null; } },
    () => null
  );
  const items = useMemo<LibraryItem[]>(() => {
    try {
      const parsed: unknown = JSON.parse(raw ?? "[]");
      return Array.isArray(parsed) ? parsed.filter((item): item is LibraryItem =>
        item && typeof item.id === "string" && typeof item.title === "string" &&
        (item.type === "template" || item.type === "reference") &&
        [item.note, item.structure, item.image, item.url, item.framework].every(v => v === undefined || typeof v === "string")
      ) : [];
    } catch { return []; }
  }, [raw]);
  function save(next: LibraryItem[]) {
    // Commit only after storage succeeds, so a full disk never looks like a save.
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event("librarychange"));
  }
  return { items, save };
}

export function safeReferenceUrl(value: string): string | undefined {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : undefined; }
  catch { return undefined; }
}

"use client";
import { useMemo, useSyncExternalStore } from "react";
import { isAnalysis } from "./analysisSchema";
import type { Analysis } from "./adAnalyzer";
export interface SavedProject {
  mode?: "ai" | "local";
  id: string;
  name: string;
  script: string;
  platform: string;
  voice: string;
  analysis: Analysis;
  createdAt: number;
}
export function useSavedProjects(uid?: string) {
  const key = `adcreator:projects:${uid ?? "guest"}`;
  const raw = useSyncExternalStore(
    (listener) => {
      window.addEventListener("storage", listener);
      window.addEventListener("projectschange", listener);
      return () => { window.removeEventListener("storage", listener); window.removeEventListener("projectschange", listener); };
    },
    () => { try { return localStorage.getItem(key); } catch { return null; } },
    () => null
  );
  const projects = useMemo<SavedProject[]>(() => {
    try { const parsed = JSON.parse(raw ?? "[]"); return Array.isArray(parsed) ? parsed.filter(p => typeof p.id === "string" && typeof p.name === "string" && typeof p.script === "string" && isAnalysis(p.analysis)) : []; }
    catch { return []; }
  }, [raw]);
  function save(project: SavedProject) {
    if (!uid) throw new Error("Sign in before saving.");
    localStorage.setItem(key, JSON.stringify([project, ...projects.filter(p => p.id !== project.id)]));
    window.dispatchEvent(new Event("projectschange"));
  }
  return { projects, save };
}

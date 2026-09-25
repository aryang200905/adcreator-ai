/* eslint-disable @next/next/no-img-element */
"use client";

import { createPortal } from "react-dom";
import { safeReferenceUrl, useLocalLibrary } from "@/lib/useLocalLibrary";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Plus,
  Bookmark,
  Link as LinkIcon,
  Trash2,
  X,
  ImagePlus,
  ExternalLink,
} from "lucide-react";
import {
  STARTER_TEMPLATES,
  type LibraryItem,
  type LibraryItemType,
} from "../../../lib/templates";
import { fileToCompressedDataURL } from "../../../lib/image";

const accentMap: Record<string, string> = {
  purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
};

export default function TemplatesPage() {
  const { user } = useAuth();
  const storageKey = `adcreator:library:${user?.uid ?? "guest"}`;
  const { items: library, save: saveLibrary } = useLocalLibrary(storageKey);
  const [saveError, setSaveError] = useState("");
  const [modalType, setModalType] = useState<LibraryItemType | null>(null);

  const persist = (items: LibraryItem[]) => {
    try { saveLibrary(items); setSaveError(""); return true; }
    catch { setSaveError("Could not save. Browser storage may be full or unavailable. Remove an image and try again."); return false; }
  };

  const addItem = (item: LibraryItem) => persist([item, ...library]);
  const removeItem = (id: string) =>
    persist(library.filter((i) => i.id !== id));

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ad Templates</h1>
          <p className="text-muted-foreground">
            Start from a copywriting framework, or save the angles and ads you love as reusable references.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModalType("reference")}
            className="h-11 px-4 bg-foreground/5 hover:bg-foreground/10 rounded-xl font-medium flex items-center gap-2 transition-all"
          >
            <Bookmark size={18} /> Add reference
          </button>
          <button
            onClick={() => setModalType("template")}
            className="h-11 px-5 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> Add template
          </button>
        </div>
      </div>

      {saveError && <p role="alert" className="mb-4 text-red-500">{saveError}</p>}
      <p className="mb-6 text-sm text-muted-foreground">Your library is saved in this browser for your account. Links and images are reference material, not automatically analyzed.</p>
      {/* Starter templates */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-1">Starter angle templates</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Save a starter to your library, then use its structure when writing a campaign. Replace the prompts with your own product details.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STARTER_TEMPLATES.map((t) => (
            <div
              key={t.acronym}
              className="bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${accentMap[t.accent]}`}
                >
                  {t.acronym}
                </span>
                <button
                  title="Save to my library"
                  onClick={() =>
                    addItem({
                      id: crypto.randomUUID(),
                      type: "template",
                      title: `${t.acronym} — ${t.name}`,
                      framework: t.acronym,
                      structure: t.structure
                        .map((s) => `${s.stage}: ${s.hint}`)
                        .join("\n"),
                      createdAt: Date.now(),
                    })
                  }
                  className="text-muted-foreground hover:text-primary p-1.5 rounded-md hover:bg-primary/10 transition-colors"
                >
                  <Bookmark size={16} />
                </button>
              </div>
              <h3 className="font-semibold mb-1">{t.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{t.bestFor}</p>
              <ol className="space-y-2 mt-auto">
                {t.structure.map((s, i) => (
                  <li key={s.stage} className="flex gap-2.5 text-sm">
                    <span className="shrink-0 w-5 h-5 rounded-md bg-foreground/5 text-muted-foreground text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-medium">{s.stage}</span>
                      <span className="text-muted-foreground"> — {s.hint}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* User library */}
      <section>
        <h2 className="text-lg font-semibold mb-1">Your library & swipe file</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Save your own templates, or bookmark links and screenshots of ads you love as reference for future campaigns.
        </p>

        {library.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/60 rounded-3xl bg-card/20 backdrop-blur-sm text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Nothing saved yet</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              Hit <span className="font-medium text-foreground">Add template</span> to save a reusable angle, or{" "}
              <span className="font-medium text-foreground">Add reference</span> to bookmark an ad you saw on TikTok, Reels, or Meta to refer to when writing your next campaign.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModalType("reference")}
                className="h-11 px-4 bg-foreground/5 hover:bg-foreground/10 rounded-xl font-medium flex items-center gap-2 transition-all"
              >
                <Bookmark size={18} /> Add reference
              </button>
              <button
                onClick={() => setModalType("template")}
                className="h-11 px-5 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={18} /> Add template
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {library.map((item) => (
              <div
                key={item.id}
                className="bg-card/40 border border-border/50 rounded-2xl p-5 backdrop-blur-md flex flex-col group relative"
              >
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 p-1.5 rounded-md hover:bg-red-500/10 opacity-100 transition-all"
                  title="Remove"
                >
                  <Trash2 size={15} />
                </button>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-36 object-cover rounded-xl mb-3 border border-border/40"
                  />
                )}

                <span
                  className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider mb-2 ${
                    item.type === "template"
                      ? "bg-primary/10 text-primary"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {item.type === "template" ? <FileText size={12} /> : <Bookmark size={12} />}
                  {item.type}
                </span>

                <h3 className="font-semibold mb-1 pr-6">{item.title}</h3>

                {item.framework && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Framework: {item.framework}
                  </p>
                )}
                {item.structure && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {item.structure}
                  </p>
                )}
                {item.note && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.note}</p>
                )}
                {item.url && safeReferenceUrl(item.url) && (
                  <a
                    href={safeReferenceUrl(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline break-all"
                  >
                    <ExternalLink size={14} className="shrink-0" /> View ad
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {modalType && (
        <AddModal
          type={modalType}
          saveError={saveError}
          onClose={() => setModalType(null)}
          onSave={(item) => {
            if (addItem(item)) setModalType(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

function AddModal({
  saveError,
  type,
  onClose,
  onSave,
}: {
  saveError: string;
  type: LibraryItemType;
  onClose: () => void;
  onSave: (item: LibraryItem) => void;
}) {
  const [title, setTitle] = useState("");
  const [framework, setFramework] = useState("");
  const [structure, setStructure] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState("");
  const [imgError, setImgError] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => { const dialog = dialogRef.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  const isTemplate = type === "template";
  const canSave = !uploading && title.trim().length > 0 && (isTemplate ? structure.trim().length > 0 : Boolean(url.trim() || image || note.trim()));

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setImgError("");
      const data = await fileToCompressedDataURL(file, 480, 0.8);
      setImage(data);
    } catch (err) {
      setImgError(err instanceof Error ? err.message : "Could not load image.");
    } finally { setUploading(false); }
  };

  const save = () => {
    if (!canSave) return;
    if (url.trim() && !safeReferenceUrl(url.trim())) { setImgError("Use a valid https:// or http:// link."); return; }
    onSave({
      id: crypto.randomUUID(),
      type,
      title: title.trim(),
      framework: isTemplate ? framework.trim() || undefined : undefined,
      structure: isTemplate ? structure.trim() || undefined : undefined,
      url: !isTemplate ? url.trim() || undefined : undefined,
      note: !isTemplate ? note.trim() || undefined : undefined,
      image: !isTemplate ? image || undefined : undefined,
      createdAt: Date.now(),
    });
  };

  const inputClass =
    "w-full bg-input/60 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all";

  return createPortal(
    <dialog ref={dialogRef} onCancel={onClose} aria-label={isTemplate ? "Add a template" : "Add a reference"} className="m-auto p-0 bg-transparent text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-sm w-[calc(100%-2rem)] max-w-lg">
      <div
        className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {isTemplate ? <FileText size={20} className="text-primary" /> : <Bookmark size={20} className="text-blue-500" />}
            {isTemplate ? "Add a template" : "Add a reference"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-md hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              {isTemplate ? "Template name" : "What is this ad?"}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isTemplate ? "e.g. My high-converting UGC hook" : "e.g. Gymshark testimonial Reel"}
              className={inputClass}
              autoFocus
            />
          </div>

          {isTemplate ? (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Framework (optional)
                </label>
                <input
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  placeholder="e.g. PAS, AIDA, custom"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Structure
                </label>
                <textarea
                  value={structure}
                  onChange={(e) => setStructure(e.target.value)}
                  placeholder={"Hook: …\nBody: …\nCTA: …"}
                  className={`${inputClass} h-32 resize-none`}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Link to the ad (optional)
                </label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://tiktok.com/@…"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Screenshot / image (optional)
                </label>
                {image ? (
                  <div className="relative w-fit">
                    <img src={image} alt="Reference" className="h-28 rounded-xl border border-border" />
                    <button
                      onClick={() => setImage("")}
                      className="absolute -top-2 -right-2 bg-card border border-border rounded-full p-1 text-muted-foreground hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-border/60 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors w-fit">
                    <ImagePlus size={18} /> Upload image
                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>
                )}
                {imgError && <p className="text-xs text-red-500 mt-2">{imgError}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Why you like it (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. The first 2 seconds are a pattern-interrupt, then it goes straight to proof."
                  className={`${inputClass} h-24 resize-none`}
                />
              </div>
            </>
          )}
        </div>

        {saveError && <p role="alert" className="mt-4 text-sm text-red-500">{saveError}</p>}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="h-11 px-5 rounded-xl font-medium text-muted-foreground hover:bg-foreground/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!canSave}
            className="h-11 px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Loading image…" : "Save"}
          </button>
        </div>
      </div>
    </dialog>, document.body
  );
}

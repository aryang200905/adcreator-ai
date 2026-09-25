"use client";

import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { isAnalysis } from "@/lib/analysisSchema";
import { useAuth } from "@/context/AuthContext";
import { useSavedProjects } from "@/lib/savedProjects";
import { useLocalLibrary } from "@/lib/useLocalLibrary";
import { useState } from "react";
import {
  Sparkles,
  Settings,
  Plus,
  Download,
  Trash2,
  CheckCircle2,
  ThumbsUp,
  AlertTriangle,
  Wrench,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PLATFORMS,
  VOICES,
  analyzeScript,
  getPlatform,
  getVoice,
  type Analysis,
} from "../../../../lib/adAnalyzer";

export default function NewProjectPage() {
  const { user } = useAuth();
  const { save: saveProject } = useSavedProjects(user?.uid);
  const { items: templates, save: saveTemplates } = useLocalLibrary(`adcreator:library:${user?.uid ?? "guest"}`);
  const [reviewMode, setReviewMode] = useState<"ai" | "local">("local");
  const [reviewNotice, setReviewNotice] = useState("");
  const [projectId, setProjectId] = useState("");
  const [saved, setSaved] = useState(false);
  const [templateSaved, setTemplateSaved] = useState("");
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scripts, setScripts] = useState([{ id: 1, content: "" }]);
  const [platform, setPlatform] = useState(PLATFORMS[0].value);
  const [voice, setVoice] = useState(VOICES[0].value);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const combinedScript = scripts.map((s) => s.content).join("\n").trim();

  const handleGenerate = async (localOnly = false) => {
    if (!combinedScript) {
      setError("Add at least one ad script so we have something to analyze.");
      return;
    }
    if (combinedScript.length > 12000) { setError("Keep each campaign under 12,000 characters."); return; }
    setError(""); setReviewNotice(""); setIsGenerating(true);
    try {
      if (!user) throw new Error("Sign in before analyzing.");
      let next: Analysis;
      let mode: "local" | "ai" = "local";
      if (localOnly) next = analyzeScript(combinedScript, platform, voice);
      else {
        const response = await fetch("/api/analyze", {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${await user.getIdToken()}` },
          body: JSON.stringify({ script: combinedScript, platform, voice }), signal: AbortSignal.timeout(60000)
        });
        const data = await response.json();
        if (data.code === "AI_NOT_CONFIGURED") {
          setReviewNotice("AI is not configured on this deployment. Showing a local structural review instead.");
          next = analyzeScript(combinedScript, platform, voice);
        } else {
          if (!response.ok || !isAnalysis(data.analysis)) throw new Error(data.error || "The AI response could not be read.");
          next = data.analysis; mode = "ai";
        }
      }
      setAnalysis(next); setReviewMode(mode); setSaved(false); setStep(2);
    } catch (err) { setError(err instanceof Error ? err.message : "Review failed. Please try again."); }
    finally { setIsGenerating(false); }
  };

  const addScriptInput = () => {
    if (scripts.length < 5) {
      setScripts([
        ...scripts,
        { id: Math.max(...scripts.map((s) => s.id)) + 1, content: "" },
      ]);
    }
  };

  const updateScript = (id: number, content: string) =>
    setScripts(scripts.map((s) => (s.id === id ? { ...s, content } : s)));

  const removeScript = (id: number) =>
    setScripts(scripts.filter((s) => s.id !== id));

  const copyRewrite = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setError("Copy failed. Select the text to copy it manually, or export the pack.");
    }
  };

  const exportPack = () => {
    if (!analysis) return;
    const p = getPlatform(platform);
    const v = getVoice(voice);
    const lines: string[] = [
      "AdCreator AI — Angle Board",
      `Platform: ${p.label}`,
      `Brand voice: ${v.label}`,
      "",
      `Review: ${reviewMode === "ai" ? "AI" : "Local structural review"}`,
      "ORIGINAL SCRIPT",
      combinedScript,
      "",
      "WHAT'S WORKING",
      ...analysis.strengths.map((s) => `+ ${s}`),
      "",
      "WHAT'S HOLDING IT BACK",
      ...analysis.weaknesses.map((s) => `- ${s}`),
      "",
      "HOW TO IMPROVE IT",
      ...analysis.improvements.map((s) => `> ${s}`),
      "",
      "3 STRONGER REWRITES",
      ...analysis.rewrites.flatMap((r) => [
        "",
        r.framework,
        `When to use: ${r.whenToUse}`,
        ...r.parts.map((part) => `  ${part.label}: ${part.text}`),
      ]),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adcreator-angle-board.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
        <p className="text-muted-foreground">
          Review one campaign at a time and explore three alternative drafts.
        </p>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">AI review sends your script to OpenAI when enabled. Local review stays in your browser and restructures your supplied text. Review claims and bracketed prompts before publishing.</p>
      {error && <p role="alert" className="mb-4 text-red-500">{error}</p>}
      <AnimatePresence mode="wait">
        {step === 1 && !isGenerating && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Input Form Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md">
                {templates.some(t => t.type === "template") && <label className="block mb-4 text-sm">Start from a saved template
                  <select aria-label="Saved template" defaultValue="" className="block w-full mt-2 rounded-xl bg-input p-3" onChange={e => { const t = templates.find(t => t.id === e.target.value); if (t?.structure) setScripts([{ id: 1, content: t.structure }]); }}>
                    <option value="" disabled>Select a template</option>{templates.filter(t => t.type === "template").map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select></label>}

                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Campaign script</h2>
                  <span className="text-xs font-medium px-2.5 py-1 bg-foreground/5 rounded-md text-muted-foreground">
                    {scripts.length} / 5 Sections
                  </span>
                </div>

                <div className="space-y-4">
                  {scripts.map((script, index) => (
                    <div key={script.id} className="relative group">
                      <div className="absolute top-3 left-3 text-xs font-bold text-primary w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <textarea
                        aria-label={`Script section ${index + 1}`}
                        maxLength={6000}
                        value={script.content}
                        onChange={(e) => updateScript(script.id, e.target.value)}
                        placeholder="Paste ad script here… (e.g. Hook: Are you tired of…)"
                        className="w-full h-32 bg-input/60 border border-border/60 rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                      />
                      {scripts.length > 1 && (
                        <button
                          aria-label={`Remove section ${index + 1}`}
                          onClick={() => removeScript(script.id)}
                          className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 p-1.5 rounded-md hover:bg-red-500/10 opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {scripts.length < 5 && (
                  <button
                    onClick={addScriptInput}
                    className="w-full mt-4 h-12 border-2 border-dashed border-border/60 rounded-xl text-primary/90 font-medium flex items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Plus size={18} /> Add another section
                  </button>
                )}

                {error && (
                  <p className="mt-4 text-sm text-red-500 font-medium">{error}</p>
                )}
              </div>
            </div>

            {/* Sidebar Settings Area */}
            <div className="space-y-6">
              <div className="bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings size={18} className="text-primary" /> Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      Target Platform
                    </label>
                    <select
                      aria-label="Target platform"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full h-11 bg-input/60 border border-border rounded-xl px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {getPlatform(platform).hookTip}
                      <a href={getPlatform(platform).source} target="_blank" rel="noopener noreferrer" className="block mt-2 text-primary underline">Official placement guidance ↗</a>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      Brand Voice & Tone
                    </label>
                    <select
                      aria-label="Brand voice and tone"
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className="w-full h-11 bg-input/60 border border-border rounded-xl px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {VOICES.map((v) => (
                        <option key={v.value} value={v.value}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {getVoice(voice).desc}
                      <span className="block mt-2">Voice is your brand personality; tone adapts to the audience. These are writing presets, not ad targeting options.</span>
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleGenerate()}
                    className="w-full h-12 bg-gradient-to-r from-primary to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:scale-[1.02]"
                  >
                    <Sparkles size={18} className="animate-pulse" />
                    Analyze & draft
                  </button>
                  <button onClick={() => handleGenerate(true)} className="mt-3 w-full text-sm text-muted-foreground hover:text-primary">Use local review</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-[50vh]"
          >
            <div className="w-20 h-20 relative mb-8">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 bg-gradient-to-tr from-primary to-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                <Sparkles size={32} className="text-white animate-spin-slow" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Extracting Patterns…</h2>
            <p className="text-muted-foreground max-w-sm text-center">
              Analyzing the hooks, objections, and structure in your script to build a custom angle board for {getPlatform(platform).label}.
            </p>
          </motion.div>
        )}

        {step === 2 && analysis && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap gap-3 items-center">
              <button className="rounded-xl bg-primary text-white px-5 py-3" disabled={saved} onClick={() => {
                try { const id = projectId || crypto.randomUUID(); saveProject({ id, name: combinedScript.slice(0, 60), script: combinedScript, platform, voice, analysis, mode: reviewMode, createdAt: Date.now() }); setProjectId(id); setSaved(true); }
                catch { setError("Could not save the project. Browser storage may be full or unavailable."); }
              }}>{saved ? "Saved as draft" : "Save project draft"}</button>
              <span className="text-sm text-muted-foreground">Saved to your account in this browser.</span>
            </div>
            <p role="status" className="text-sm text-muted-foreground">{reviewNotice || (reviewMode === "ai" ? "AI review · Verify claims before publishing." : "Local review · These are structural drafts, not AI-written copy.")}</p>
            {/* Pattern Map */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={20} />
                Pattern Map — {getPlatform(platform).label} · {getVoice(voice).label}
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.signals.map((sig) => (
                  <span
                    key={sig}
                    className="px-3 py-1.5 bg-background/60 border border-border/50 rounded-lg text-sm text-emerald-600 dark:text-emerald-300 font-medium"
                  >
                    {sig}
                  </span>
                ))}
              </div>
            </div>

            {/* Critique: Good / Bad / Improve */}
            <div className="grid md:grid-cols-3 gap-6">
              <CritiqueCard
                title="What's working"
                icon={<ThumbsUp size={18} />}
                tone="good"
                items={analysis.strengths}
              />
              <CritiqueCard
                title="What's holding it back"
                icon={<AlertTriangle size={18} />}
                tone="bad"
                items={analysis.weaknesses}
              />
              <CritiqueCard
                title="How to improve it"
                icon={<Wrench size={18} />}
                tone="improve"
                items={analysis.improvements}
              />
            </div>

            {/* Rewrites */}
            <div className="flex items-center justify-between mb-4 mt-8">
              <h2 className="text-xl font-bold">3 Alternative Drafts</h2>
              <button
                onClick={exportPack}
                className="h-10 px-4 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Download size={16} /> Export Pack
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {analysis.rewrites.map((r, i) => {
                const badgeColor = [
                  "bg-purple-500/10 text-purple-500 border-purple-500/20",
                  "bg-blue-500/10 text-blue-500 border-blue-500/20",
                  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                ][i % 3];
                const flat = r.parts
                  .map((p) => `${p.label}: ${p.text}`)
                  .join("\n\n");
                return (
                  <div
                    key={r.key}
                    className="bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md relative flex flex-col"
                  >
                    <button
                      onClick={() => copyRewrite(r.key, `${r.framework}\n\n${flat}`)}
                      className="absolute top-4 right-4 p-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-colors"
                      title="Copy this rewrite"
                    >
                      {copiedKey === r.key ? (
                        <Check size={16} className="text-emerald-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border w-fit ${badgeColor}`}
                    >
                      {r.framework.split("—")[0].trim()}
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      {r.whenToUse}
                    </p>
                    <button className="text-sm text-primary text-left mb-4 hover:underline" onClick={() => {
                      try { saveTemplates([{ id: crypto.randomUUID(), type: "template", title: `${r.framework}: ${combinedScript.slice(0, 35)}`, structure: flat, createdAt: Date.now() }, ...templates]); setTemplateSaved(r.key); }
                      catch { setError("Could not save this template. Browser storage may be full or unavailable."); }
                    }}>{templateSaved === r.key ? "Saved to templates" : "Save as template"}</button>
                    <div className="space-y-3">
                      {r.parts.map((part) => (
                        <div key={part.label}>
                          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">
                            {part.label}
                          </span>
                          <p
                            className={`text-sm leading-relaxed p-3 rounded-lg whitespace-pre-line ${
                              part.label === "CTA" || part.label === "Action"
                                ? "bg-primary/10 border border-primary/20 font-medium"
                                : "bg-inset border border-border/40"
                            }`}
                          >
                            {part.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setStep(1);
                  setAnalysis(null);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Edit script & regenerate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

function CritiqueCard({
  title,
  icon,
  tone,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  tone: "good" | "bad" | "improve";
  items: string[];
}) {
  const toneClass = {
    good: "text-emerald-500",
    bad: "text-amber-600 dark:text-amber-400",
    improve: "text-primary",
  }[tone];
  const dotClass = {
    good: "bg-emerald-500",
    bad: "bg-amber-500",
    improve: "bg-primary",
  }[tone];

  return (
    <div className="bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md">
      <h3 className={`font-bold mb-4 flex items-center gap-2 ${toneClass}`}>
        {icon} {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

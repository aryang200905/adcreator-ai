"use client";

import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ArrowLeft, Copy, Check, Layers } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSavedProjects } from "@/lib/savedProjects";
import { getPlatform } from "@/lib/adAnalyzer";
import { getProject } from "../../../../lib/projects";

export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  const { projects: savedProjects } = useSavedProjects(user?.uid);
  const savedProject = savedProjects.find(p => p.id === id);
  const project = getProject(id);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!project) return;
    const text = `Framework: ${project.framework}\n\nHook:\n${project.hook}\n\nBody:\n${project.body}\n\nCTA:\n${project.cta}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (savedProject) return <DashboardLayout>
    <Link href="/dashboard" className="text-primary">← Back to projects</Link>
    <h1 className="text-3xl font-bold my-6">{savedProject.name}</h1>
    <p className="text-muted-foreground mb-6">Draft · {getPlatform(savedProject.platform).label} · {savedProject.mode === "ai" ? "AI review" : "Local copy review"}</p>
    <h2 className="text-xl font-semibold mb-3">Original script</h2><p className="whitespace-pre-wrap rounded-xl bg-card p-5 mb-6">{savedProject.script}</p>
    <div className="grid md:grid-cols-3 gap-4 mb-8">{[["What's working", savedProject.analysis.strengths], ["What's holding it back", savedProject.analysis.weaknesses], ["How to improve", savedProject.analysis.improvements]].map(([title, items]) => <section className="bg-card/50 rounded-xl p-5" key={title as string}><h2 className="font-semibold mb-3">{title}</h2><ul className="space-y-3 text-sm text-muted-foreground">{(items as string[]).map(item => <li key={item}>{item}</li>)}</ul></section>)}</div>
    <div className="grid md:grid-cols-3 gap-4">{savedProject.analysis.rewrites.map(r => <section className="bg-card/50 rounded-xl p-5" key={r.key}><h2 className="font-semibold mb-4">{r.framework}</h2>{r.parts.map(part => <div className="mb-4" key={part.label}><h3 className="text-xs text-primary mb-2">{part.label}</h3><p>{part.text}</p></div>)}</section>)}</div>
  </DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {project ? project.name : "Project Overview"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {project ? project.description : `Viewing project ID: ${id}`}
        </p>
      </div>

      {project?.sample && <p className="mb-4 text-sm text-muted-foreground">Example draft · Fictional brand and illustrative claims; not a live campaign.</p>}
      {!project ? (
        <div className="rounded-2xl border border-border/50 bg-card/20 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-semibold mb-3">Project not found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            This project is not available. Return to the dashboard to choose a draft.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Ad Creative Area */}
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 flex flex-col backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Ad Creative</h2>
              <span className="text-xs font-medium px-2.5 py-1 bg-primary/10 text-primary rounded-md">
                {project.platform}
              </span>
            </div>
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-inset border border-border/60">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} flex flex-col items-center justify-center text-center p-6`}>
                  <div className="w-16 h-16 rounded-2xl bg-background/40 backdrop-blur-sm flex items-center justify-center mb-4 text-primary">
                    <Layers size={30} />
                  </div>
                  <p className="text-lg font-bold">{project.hook.replaceAll('"', "")}</p>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{project.body}</p><p className="mt-6 rounded-full bg-primary px-5 py-3 text-sm text-white">{project.cta.replaceAll('"', "")}</p>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/60">
                <p className="text-xs font-semibold text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  {project.image ? "Example creative" : "Concept mockup"}
                </p>
              </div>
            </div>
          </div>

          {/* Ad Script Area */}
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 flex flex-col backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 gap-3">
               <h2 className="text-xl font-bold">Ad Script</h2>
               <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20 text-right">
                 {project.framework}
               </div>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Hook</span>
                <p className="text-base mt-2 font-medium bg-inset p-4 rounded-xl border border-border/40">{project.hook}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Body</span>
                <p className="text-base text-muted-foreground mt-2 leading-relaxed bg-inset p-4 rounded-xl border border-border/40">{project.body}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Call to Action</span>
                <p className="text-base mt-2 bg-primary/15 p-4 rounded-xl font-medium border border-primary/30">{project.cta}</p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full mt-6 h-12 bg-foreground/5 hover:bg-foreground/10 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <><Check size={18} className="text-emerald-500" /> Copied!</> : <><Copy size={18} /> Copy Script</>}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

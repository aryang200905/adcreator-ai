"use client";

import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ArrowLeft, Copy } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

const mockProjects: Record<string, any> = {
  "1": {
    name: "Q1 Fitness Campaign",
    description: "App conversion campaign targeting men/women 18-35 for new year fitness resolutions.",
    image: "/images/fitness_ad.png",
    framework: "PAS Framework (Problem, Agitate, Solution)",
    hook: "\"Are you tired of starting over every single January?\"",
    body: "You hit the gym for two weeks, get overwhelmed by the confusing equipment, and lose all motivation by February. It's frustrating and expensive. But what if you had a personal trainer in your pocket that built custom workouts for your exact body and goals? Introducing FitPro.",
    cta: "\"Download now and get your first 30 days free!\""
  },
  "2": {
    name: "SaaS Explainer Concepts",
    description: "B2B Lead Generation campaign for new AI Analytics feature.",
    image: "/images/saas_ad.png",
    framework: "BAB Framework (Before, After, Bridge)",
    hook: "\"Your team is spending 15 hours a week manually pulling reports.\"",
    body: "Imagine clicking one button and having all your multi-channel data normalized, visualized, and ready for your Monday meeting. Spectra AI connects to all your existing tools out-of-the-box and does the heavy lifting for you.",
    cta: "\"Start your 14-day free trial today.\""
  },
  "3": {
    name: "Holiday Promo UGC",
    description: "End of year Q4 sales push leveraging user-generated content.",
    image: "/images/holiday_ad.png",
    framework: "4 P's (Promise, Picture, Proof, Push)",
    hook: "\"Get the perfect gift for them, and peace of mind for you.\"",
    body: "Picture the smile on their face when they unwrap the cozy comfort they've been asking for. Over 10,000 happy customers agree this is the best purchase they've made all year. But hurry, our holiday shipping cutoff is in 48 hours.",
    cta: "\"Click here to shop the 30% off Holiday Sale before it's gone!\""
  }
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const project = mockProjects[id];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          {project ? project.name : "Project Overview"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {project ? project.description : `Viewing project ID: ${id}`}
        </p>
      </div>

      {!project ? (
        <div className="rounded-2xl border border-border/50 bg-card/20 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-semibold text-white mb-3">Project Details Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            This page will display the detailed analytics and generated variants for this campaign.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Ad Creative Area */}
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 flex flex-col backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-4">Ad Creative</h2>
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-black/50 border border-white/10">
              <Image 
                src={project.image} 
                alt={project.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <p className="text-xs font-semibold text-purple-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                  Image by Gemini
                </p>
              </div>
            </div>
          </div>

          {/* Ad Script Area */}
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 flex flex-col backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-bold text-white">Ad Script</h2>
               <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                 {project.framework}
               </div>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Hook</span>
                <p className="text-base text-gray-200 mt-2 font-medium bg-black/20 p-4 rounded-xl border border-white/5">{project.hook}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Body</span>
                <p className="text-base text-gray-300 mt-2 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">{project.body}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Call to Action</span>
                <p className="text-base text-gray-200 mt-2 bg-primary/20 text-white p-4 rounded-xl font-medium border border-primary/30">{project.cta}</p>
              </div>
            </div>

            <button className="w-full mt-6 h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
              <Copy size={18} />
              Copy Script
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

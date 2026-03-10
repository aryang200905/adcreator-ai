"use client";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import { FileText, Sparkles } from "lucide-react";

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ad Templates</h1>
        <p className="text-muted-foreground">Save and manage your best-performing ad angle structures.</p>
      </div>

      <div className="flex flex-col items-center justify-center p-12 mt-12 border-2 border-dashed border-border/50 rounded-3xl bg-card/20 backdrop-blur-sm">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
          <FileText size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Templates Yet</h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          When you generate ad variants in a project, you can save the best performing angles here as reusable templates for your team.
        </p>
        <button className="h-11 px-6 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Sparkles size={18} />
          Discover AI Templates
        </button>
      </div>
    </DashboardLayout>
  );
}

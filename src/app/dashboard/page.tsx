"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Plus, Folder, Clock, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Dummy projects to match the PRD "Project Library" concept
  const projects = [
    { id: 1, name: "Q1 Fitness Campaign", items: 12, date: "Mar 10, 2026", status: "Generated" },
    { id: 2, name: "SaaS Explainer Concepts", items: 8, date: "Mar 08, 2026", status: "Draft" },
    { id: 3, name: "Holiday Promo UGC", items: 24, date: "Mar 01, 2026", status: "Exported" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-muted-foreground">Here are your recent ad generation projects.</p>
        </div>
        <Link 
          href="/dashboard/project/new"
          className="h-11 px-6 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
        >
          <Plus size={18} className="transition-transform group-hover:rotate-90" />
          New Project
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card */}
        <Link href="/dashboard/project/new">
          <div className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 bg-card/10 hover:bg-card/30 transition-all flex flex-col items-center justify-center p-6 text-center group cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Create New Project</h3>
            <p className="text-sm text-muted-foreground">Start analyzing winning ads and generating new variants.</p>
          </div>
        </Link>

        {/* Existing Projects */}
        {projects.map((project) => (
          <Link href={`/dashboard/project/${project.id}`} key={project.id} className="block group">
            <div className="h-full min-h-[220px] rounded-2xl border border-border/50 bg-card/40 hover:bg-card/60 backdrop-blur-sm transition-all flex flex-col p-6 relative cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Folder size={20} />
                </div>
                <button className="text-muted-foreground hover:text-white p-1 rounded-md hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Clock size={14} className="text-primary/70" /> {project.date}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                <span className="text-xs font-medium px-2.5 py-1 bg-white/5 rounded-md text-gray-300">
                  {project.items} variants
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                  project.status === 'Generated' ? 'bg-green-500/10 text-green-400' :
                  project.status === 'Draft' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}

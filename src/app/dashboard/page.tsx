"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Plus, Folder, Clock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useSavedProjects } from "@/lib/savedProjects";
import { projects } from "../../lib/projects";

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects: savedProjects } = useSavedProjects(user?.uid);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-muted-foreground">Explore five example drafts, then create a campaign of your own.</p>
      </div>

      {savedProjects.length > 0 && <section className="mb-8"><h2 className="text-xl font-semibold mb-3">Your drafts</h2><p className="text-sm text-muted-foreground mb-4">Saved in this browser.</p><div className="grid md:grid-cols-3 gap-4">{savedProjects.map(p => <Link className="p-6 rounded-2xl border border-border bg-card/40" key={p.id} href={`/dashboard/project/${p.id}`}><h3 className="font-semibold break-words">{p.name}</h3><p className="mt-3 text-sm text-primary">Draft · 3 alternatives</p></Link>)}</div></section>}
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card — the single entry point for creating a project */}
        <Link href="/dashboard/project/new">
          <div className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-card/20 hover:bg-card/40 transition-all flex flex-col items-center justify-center p-6 text-center group cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
            <p className="text-sm text-muted-foreground">Start analyzing winning ads and generating new variants.</p>
          </div>
        </Link>

        {/* Existing Projects */}
        {projects.map((project) => (
          <Link href={`/dashboard/project/${project.id}`} key={project.id} className="block group">
            <div className="h-full min-h-[220px] rounded-2xl border border-border/70 bg-card/40 hover:bg-card/70 backdrop-blur-sm transition-all flex flex-col p-6 relative cursor-pointer shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Folder size={20} />
                </div>
                <div className="flex items-center gap-2">
                  {project.sample && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                      Sample
                    </span>
                  )}

                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Clock size={14} className="text-primary/70" /> {project.date}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/60">
                <span className="text-xs font-medium px-2.5 py-1 bg-foreground/5 rounded-md text-muted-foreground">
                  Example ad
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                  project.status === 'Generated' ? 'bg-green-500/10 text-green-500' :
                  project.status === 'Draft' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-blue-500/10 text-blue-500'
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

/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Settings, LogOut, ChevronRight, Menu } from "lucide-react";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!loading && !user) {
      router.push("/");
    }
    // Auto collapse on mobile initially
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [user, loading, router]);

  if (loading || !user || !isMounted) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading...</div>;

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/");
  };

  const navItems = [
    { label: "Projects", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Templates", icon: FileText, href: "/dashboard/templates" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`shrink-0 border-r border-border/50 bg-card/95 lg:bg-card/30 backdrop-blur-xl flex flex-col fixed lg:relative inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen 
            ? 'w-64 translate-x-0' 
            : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`h-16 flex items-center px-6 border-b border-border/50 cursor-pointer hover:bg-white/5 transition-colors ${
            !isSidebarOpen && 'lg:justify-center lg:px-0'
          }`}
          title="Toggle Sidebar"
        >
          <div className={`w-8 h-8 shrink-0 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center ${
            isSidebarOpen ? 'mr-3' : 'lg:mr-0 mr-3'
          }`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={`font-bold text-lg tracking-tight whitespace-nowrap transition-opacity duration-200 ${
            !isSidebarOpen ? 'lg:hidden opacity-100' : 'opacity-100'
          }`}>
            AdCreator AI
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-x-hidden">
           {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              title={!isSidebarOpen ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-white/5 hover:text-white'
              } ${!isSidebarOpen && 'lg:justify-center lg:px-0'}`}
            >
              <item.icon size={18} className="shrink-0" />
              <span className={`transition-opacity duration-200 ${!isSidebarOpen ? 'lg:hidden opacity-100' : 'opacity-100'}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50 overflow-x-hidden">
          <div className={`flex items-center gap-3 px-3 py-2 mb-4 ${!isSidebarOpen && 'lg:justify-center lg:px-0'}`}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-primary/50 shrink-0" />
            ) : (
              <div className="w-8 h-8 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </div>
            )}
            <div className={`flex-1 min-w-0 transition-opacity duration-200 ${!isSidebarOpen ? 'lg:hidden opacity-100' : 'opacity-100'}`}>
              <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            title={!isSidebarOpen ? "Sign Out" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium whitespace-nowrap ${
              !isSidebarOpen && 'lg:justify-center lg:px-0'
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={`transition-opacity duration-200 ${!isSidebarOpen ? 'lg:hidden opacity-100' : 'opacity-100'}`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto w-full relative">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center px-6 gap-4">
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-white"
            title="Open Sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            {pathname !== "/dashboard" && (
              <>
                <ChevronRight size={14} />
                <span className="text-white font-medium capitalize">
                  {pathname.split('/').pop()?.replace('-', ' ')}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

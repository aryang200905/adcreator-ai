"use client";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import { Settings, User, Bell, Shield, CreditCard } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'notifications' | 'security'>('profile');

  const getTabClass = (tab: string) => {
    return `w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${
      activeTab === tab 
        ? 'bg-primary/10 text-primary' 
        : 'text-muted-foreground hover:bg-white/5 hover:text-white'
    }`;
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and team settings.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="space-y-2">
          <button onClick={() => setActiveTab('profile')} className={getTabClass('profile')}>
            <User size={18} /> Profile
          </button>
          <button onClick={() => setActiveTab('billing')} className={getTabClass('billing')}>
            <CreditCard size={18} /> Billing
          </button>
          <button onClick={() => setActiveTab('notifications')} className={getTabClass('notifications')}>
            <Bell size={18} /> Notifications
          </button>
          <button onClick={() => setActiveTab('security')} className={getTabClass('security')}>
            <Shield size={18} /> Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' ? (
            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              {user?.photoURL ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full border-2 border-primary/50" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-3xl border-2 border-primary/50">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors mb-2">
                  Change Photo
                </button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.displayName || ''}
                  className="w-full h-11 bg-input/50 border border-border rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  disabled
                  className="w-full h-11 bg-black/20 border border-border/50 rounded-xl px-4 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="h-11 px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Save Changes
              </button>
            </div>
            </div>
          ) : (
            <div className="bg-card/40 border border-border/50 rounded-2xl p-12 backdrop-blur-md flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                {activeTab === 'billing' && <CreditCard size={32} />}
                {activeTab === 'notifications' && <Bell size={32} />}
                {activeTab === 'security' && <Shield size={32} />}
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 capitalize">{activeTab}</h2>
              <p className="text-muted-foreground max-w-sm">
                This section is currently in development. Check back later for updates as we roll out new features.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

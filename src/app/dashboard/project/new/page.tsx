"use client";

import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { useState } from "react";
import { Sparkles, Settings, Plus, Download, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scripts, setScripts] = useState([{ id: 1, content: "" }]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setStep(2);
    }, 4000);
  };

  const addScriptInput = () => {
    if (scripts.length < 5) {
      setScripts([...scripts, { id: scripts.length + 1, content: "" }]);
    }
  };

  const updateScript = (id: number, content: string) => {
    setScripts(scripts.map(s => s.id === id ? { ...s, content } : s));
  };

  const removeScript = (id: number) => {
    setScripts(scripts.filter(s => s.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
        <p className="text-muted-foreground">Upload your top-performing ads to extract patterns and generate new variants.</p>
      </div>

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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Winning Ad Scripts</h2>
                  <span className="text-xs font-medium px-2.5 py-1 bg-white/5 rounded-md text-gray-300">
                    {scripts.length} / 5 Scripts
                  </span>
                </div>
                
                <div className="space-y-4">
                  {scripts.map((script, index) => (
                    <div key={script.id} className="relative group">
                      <div className="absolute top-3 left-3 text-xs font-bold text-primary w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <textarea
                        value={script.content}
                        onChange={(e) => updateScript(script.id, e.target.value)}
                        placeholder="Paste ad script here... (e.g. Hook: Are you tired of...)"
                        className="w-full h-32 bg-input/40 border border-border/50 rounded-xl pl-12 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                      />
                      {scripts.length > 1 && (
                        <button 
                          onClick={() => removeScript(script.id)}
                          className="absolute top-3 right-3 text-muted-foreground hover:text-red-400 p-1.5 rounded-md hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
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
                    className="w-full mt-4 h-12 border-2 border-dashed border-border/60 rounded-xl text-primary/80 font-medium flex items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Plus size={18} /> Add another script
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar Settings Area */}
            <div className="space-y-6">
              <div className="bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings size={18} className="text-primary" /> Settings
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block">Target Platform</label>
                    <select className="w-full h-11 bg-input/50 border border-border rounded-xl px-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>TikTok / IG Reels</option>
                      <option>Facebook Ads</option>
                      <option>YouTube Shorts</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block">Brand Voice & Tone</label>
                    <select className="w-full h-11 bg-input/50 border border-border rounded-xl px-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Authentic UGC / Casual</option>
                      <option>Direct Response / Hard Sell</option>
                      <option>Professional B2B</option>
                      <option>Humorous / Edgy</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={handleGenerate}
                    className="w-full h-12 bg-gradient-to-r from-primary to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all hover:scale-[1.02]"
                  >
                    <Sparkles size={18} className="animate-pulse" />
                    Generate Variants
                  </button>
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
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Extracting Patterns...</h2>
            <p className="text-muted-foreground max-w-sm text-center">
              Our AI is analyzing the hooks, objections, and story structures from your winning scripts to build a custom angle board.
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Analysis Summary */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={20} />
                Pattern Map Identified
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-black/40 rounded-lg text-sm text-emerald-300 font-medium">✨ Problem/Agitate Hook</span>
                <span className="px-3 py-1.5 bg-black/40 rounded-lg text-sm text-emerald-300 font-medium">💰 Value-stacking Offer</span>
                <span className="px-3 py-1.5 bg-black/40 rounded-lg text-sm text-emerald-300 font-medium">🔥 Urgency CTA</span>
              </div>
            </div>

            {/* Generated Variants Area */}
            <div className="flex items-center justify-between mb-4 mt-8">
              <h2 className="text-xl font-bold text-white">Generated Angle Board</h2>
              <button className="h-10 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Download size={16} /> Export Pack
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Variant Card 1 */}
              <div className="bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md group relative">
                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                   <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" title="Regenerate">
                     <Sparkles size={16} />
                   </button>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
                  Angle 1: The Contrarian
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Hook</span>
                    <p className="text-sm text-gray-200 mt-1 font-medium bg-black/20 p-3 rounded-lg border border-white/5">&quot;Stop doing X immediately if you want to achieve Y. Here&apos;s what I wish I knew sooner...&quot;</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Body</span>
                    <p className="text-sm text-gray-300 mt-1 leading-relaxed">The old way of solving this problem is broken. Introduce the new mechanism. Show social proof of how it worked for others faster and cheaper.</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">CTA</span>
                    <p className="text-sm text-gray-200 mt-1 bg-primary/10 text-primary-foreground p-3 rounded-lg font-medium">&quot;Click the link below to get the free blueprint.&quot;</p>
                  </div>
                </div>
              </div>

              {/* Variant Card 2 */}
              <div className="bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md group relative">
                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                   <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" title="Regenerate">
                     <Sparkles size={16} />
                   </button>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
                  Angle 2: Founder Story
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Hook</span>
                    <p className="text-sm text-gray-200 mt-1 font-medium bg-black/20 p-3 rounded-lg border border-white/5">&quot;I was struggling with [Pain Point] for years until I discovered this weird trick.&quot;</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Body</span>
                    <p className="text-sm text-gray-300 mt-1 leading-relaxed">Tell brief origin story. Focus on the &apos;aha&apos; moment. Present the product as the effortless solution that emerged.</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">CTA</span>
                    <p className="text-sm text-gray-200 mt-1 bg-primary/10 text-primary-foreground p-3 rounded-lg font-medium">&quot;Try it risk-free today and see the difference.&quot;</p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}

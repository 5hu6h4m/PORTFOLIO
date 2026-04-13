'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Code2, Zap, Eye, EyeOff, Save, AlertTriangle } from 'lucide-react';
import { safeStorage } from '@/lib/safe-storage';

interface AboutSettings {
  showGithub: boolean;
  showLeetcode: boolean;
  showCustom: boolean;
  customTitle: string;
  customDesc: string;
  resumeUrl: string;
}



export default function SettingsPage() {
  const [settings, setSettings] = useState<AboutSettings>({
    showGithub: true,
    showLeetcode: false,
    showCustom: true,
    customTitle: 'Currently Leveling Up',
    customDesc: 'Building real-world projects, sharpening DSA skills, and working toward 200+ LeetCode problems.',
    resumeUrl: ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/settings/about-sections`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key: keyof AboutSettings, val: boolean) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: val };

      // Core logic: LeetCode ON → Custom auto-OFF
      if (key === 'showLeetcode' && val === true) {
        updated.showCustom = false;
      }
      // Custom ON → LeetCode auto-OFF
      if (key === 'showCustom' && val === true) {
        updated.showLeetcode = false;
      }

      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const token = safeStorage.getItem('adminToken');
      const res = await fetch(`/api/settings/about-sections`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const blocks = [
    {
      key: 'showGithub' as const,
      label: 'GitHub Stats',
      icon: Github,
      color: '#ffffff',
      description: 'Shows GitHub metrics — commits, stars, PRs, language breakdown, and grade.',
      warning: null,
    },
    {
      key: 'showLeetcode' as const,
      label: 'LeetCode Stats',
      icon: Code2,
      color: '#FFA116',
      description: 'Shows LeetCode problem stats — Easy/Medium/Hard solved, global rank.',
      warning: '⚠️ Enable only when 200+ problems solved for best impression.',
    },
    {
      key: 'showCustom' as const,
      label: 'Custom Block',
      icon: Zap,
      color: '#00f5d4',
      description: 'A custom card — configure its title and description below.',
      warning: null,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 rounded-[2rem] bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
          About <span className="text-primary italic">Settings</span>
        </h1>
        <p className="text-gray-500 text-sm border-l-2 border-primary/30 pl-4 py-1">
          Control which blocks appear in the About section of the portfolio.
          <br />
          <span className="text-primary/60 font-bold">Rule: Always 2 blocks are shown. LeetCode ON → Custom auto-hides.</span>
        </p>
      </div>

      {/* Toggle Cards */}
      <div className="space-y-4">
        {blocks.map(({ key, label, icon: Icon, color, description, warning }) => {
          const isOn = settings[key] as boolean;
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.01 }}
              className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between gap-6 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-5 relative z-10">
                <div
                  className="p-3 rounded-2xl bg-white/5 border border-white/10"
                  style={{ boxShadow: isOn ? `0 0 20px ${color}33` : 'none' }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-white text-sm tracking-tight">{label}</h3>
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{
                        background: isOn ? `${color}22` : 'rgba(255,255,255,0.05)',
                        color: isOn ? color : 'rgba(255,255,255,0.3)',
                        border: `1px solid ${isOn ? color + '44' : 'rgba(255,255,255,0.1)'}`
                      }}
                    >
                      {isOn ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">{description}</p>
                  {warning && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <p className="text-amber-400/80 text-[10px] font-bold">{warning}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(key, !isOn)}
                className="relative w-14 h-7 rounded-full shrink-0 transition-all duration-300 focus:outline-none z-10"
                style={{
                  background: isOn ? color : 'rgba(255,255,255,0.1)',
                  boxShadow: isOn ? `0 0 15px ${color}55` : 'none'
                }}
              >
                <motion.div
                  animate={{ x: isOn ? 30 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Resume Management */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[2rem] bg-white/5 border border-primary/20 space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Save className="w-5 h-5 text-primary" />
            <h3 className="font-black text-white text-sm uppercase tracking-widest">Resume Management</h3>
          </div>
          {settings.resumeUrl && (
            <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
              File Ready
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 border-dashed hover:border-primary/30 transition-all flex flex-col items-center gap-4">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const { uploadFile } = await import('@/lib/admin-api');
                  const res = await uploadFile(file);
                  setSettings(prev => ({ ...prev, resumeUrl: res.imageUrl }));
                } catch (err) {
                  alert('Resume upload failed');
                }
              }} 
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
            />
            {settings.resumeUrl ? (
              <div className="flex items-center gap-3 text-xs text-white/60">
                <span className="truncate max-w-[200px] font-mono">{settings.resumeUrl}</span>
                <button 
                  onClick={() => setSettings(prev => ({ ...prev, resumeUrl: '' }))}
                  className="text-red-400 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-[10px] text-gray-500 italic">No resume uploaded. "Network Issue" mode will trigger.</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Custom Block Editor */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[2rem] bg-white/5 border border-primary/20 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-black text-white text-sm uppercase tracking-widest">Custom Block Content</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest text-primary font-bold ml-1">Title</label>
            <input
              value={settings.customTitle}
              onChange={e => setSettings(prev => ({ ...prev, customTitle: e.target.value }))}
              placeholder="Currently Leveling Up"
              className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-mono text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest text-primary font-bold ml-1">Description</label>
            <textarea
              value={settings.customDesc}
              onChange={e => setSettings(prev => ({ ...prev, customDesc: e.target.value }))}
              placeholder="What are you working on? What are you learning?"
              rows={4}
              className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-mono text-xs text-white resize-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_rgba(0,245,212,0.4)] active:scale-95 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}

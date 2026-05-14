"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSettings, updateSettings } from "@/firebase/services";
import { useAuth } from "@/hooks/useAuth";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/firebase/config";
import toast from "react-hot-toast";

export default function SettingsAdminPage() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("codee.erra");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    getSettings().then(s => { if (s?.companyName) setCompanyName(s.companyName); }).catch(() => {});
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try { await updateSettings({ companyName }); toast.success("Settings saved"); }
    catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) { toast.error("Fill both fields"); return; }
    if (newPw.length < 6) { toast.error("Password must be 6+ chars"); return; }
    setChangingPw(true);
    try {
      const credential = EmailAuthProvider.credential(user!.email!, currentPw);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updatePassword(auth.currentUser!, newPw);
      toast.success("Password updated");
      setCurrentPw(""); setNewPw("");
    } catch { toast.error("Incorrect current password"); }
    finally { setChangingPw(false); }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
        <p className="text-text-secondary font-body mt-1">Manage site settings and account security</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Site Settings */}
        <div className="glass rounded-xl p-6 neon-border">
          <h2 className="font-display text-sm font-bold gradient-text tracking-widest mb-5">SITE SETTINGS</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">COMPANY NAME</label>
              <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm" />
            </div>
            <div>
              <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">ADMIN EMAIL</label>
              <input value={user?.email || ""} disabled className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm opacity-50 cursor-not-allowed" />
            </div>
          </div>
          <button onClick={handleSaveSettings} disabled={saving}
            className="w-full mt-5 neon-btn-filled py-3 rounded-lg font-display text-sm tracking-widest disabled:opacity-50">
            {saving ? "SAVING..." : "SAVE SETTINGS"}
          </button>
        </div>

        {/* Password */}
        <div className="glass rounded-xl p-6 neon-border">
          <h2 className="font-display text-sm font-bold gradient-text tracking-widest mb-5">CHANGE PASSWORD</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">CURRENT PASSWORD</label>
              <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">NEW PASSWORD</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm" placeholder="••••••••" />
            </div>
          </div>
          <button onClick={handleChangePassword} disabled={changingPw}
            className="w-full mt-5 neon-btn py-3 rounded-lg font-display text-sm tracking-widest disabled:opacity-50">
            {changingPw ? "UPDATING..." : "UPDATE PASSWORD"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

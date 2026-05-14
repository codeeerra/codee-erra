"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { uploadImage, updateSettings, getSettings } from "@/firebase/services";
import toast from "react-hot-toast";
import { FiUpload, FiRefreshCw } from "react-icons/fi";
import { useEffect } from "react";

export default function LogoAdminPage() {
  const [currentLogo, setCurrentLogo] = useState<string>("/logo.jpeg");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSettings().then(s => { if (s?.logoUrl) setCurrentLogo(s.logoUrl); }).catch(() => {});
  }, []);

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, `settings/logo_${Date.now()}`);
      await updateSettings({ logoUrl: url });
      setCurrentLogo(url);
      setPreview(null);
      setFile(null);
      toast.success("Logo updated successfully");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Logo Management</h1>
        <p className="text-text-secondary font-body mt-1">Upload and manage your company logo</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Current Logo */}
        <div className="glass rounded-xl p-8 neon-border text-center">
          <div className="text-xs font-display tracking-widest text-text-secondary mb-4">CURRENT LOGO</div>
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden neon-border mx-auto shadow-[0_0_30px_rgba(0,217,255,0.2)]">
            <Image src={currentLogo} alt="Logo" fill className="object-cover" />
          </div>
          <p className="text-text-secondary font-body text-xs mt-4">This logo appears across your website</p>
        </div>

        {/* Upload */}
        <div className="glass rounded-xl p-8 neon-border">
          <div className="text-xs font-display tracking-widest text-text-secondary mb-4">UPLOAD NEW LOGO</div>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            className="border-2 border-dashed border-cyan-500/30 rounded-xl p-10 text-center cursor-pointer hover:border-accent-cyan transition-colors"
          >
            {preview ? (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden mx-auto">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-text-secondary">
                <FiUpload size={32} className="text-accent-cyan" />
                <p className="font-body text-sm">Drag & drop or click to upload</p>
                <p className="font-body text-xs">PNG, JPG, SVG — recommended 512×512px</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

          {file && (
            <div className="mt-4 p-3 glass rounded-lg flex items-center justify-between">
              <span className="text-sm font-body text-text-secondary truncate">{file.name}</span>
              <button onClick={() => { setFile(null); setPreview(null); }} className="text-text-secondary hover:text-white ml-2">✕</button>
            </div>
          )}

          <button onClick={handleUpload} disabled={!file || uploading}
            className="w-full mt-4 neon-btn-filled py-4 rounded-xl font-display text-sm tracking-widest disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {uploading ? <><FiRefreshCw size={14} className="animate-spin" /> UPLOADING...</> : <><FiUpload size={14} /> UPLOAD LOGO</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

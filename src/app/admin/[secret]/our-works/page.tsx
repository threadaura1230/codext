"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit2, Trash2, Globe, Layout, Code2, 
  Rocket, Database, Check, X, Image as ImageIcon, 
  Loader2, Filter, Tag, ExternalLink, Save, AlertCircle
} from "lucide-react";
import AdminHeader from "@/admin/components/layouts/AdminHeader";

// Icon mapping
const iconOptions = [
  { name: "Layout", icon: Layout },
  { name: "Code2", icon: Code2 },
  { name: "Rocket", icon: Rocket },
  { name: "Database", icon: Database },
  { name: "Globe", icon: Globe }
];

interface Work {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  iconName: string;
  slug: string;
  isActive: boolean;
  order: number;
}

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    tagsString: "",
    iconName: "Layout",
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const res = await fetch("/api/our-works");
      const data = await res.json();
      setWorks(data);
    } catch (error) {
      console.error("Failed to fetch works", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (work?: Work) => {
    setError("");
    if (work) {
      setEditingWork(work);
      setFormData({
        title: work.title,
        category: work.category,
        description: work.description,
        image: work.image,
        tagsString: work.tags.join(", "),
        iconName: work.iconName,
        isActive: work.isActive,
        order: work.order
      });
    } else {
      setEditingWork(null);
      setFormData({
        title: "",
        category: "",
        description: "",
        image: "",
        tagsString: "",
        iconName: "Layout",
        isActive: true,
        order: works.length
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.imageUrl }));
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (error) {
      setError("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    const submitData = {
      ...formData,
      tags: formData.tagsString.split(",").map(t => t.trim()).filter(t => t !== "")
    };

    try {
      const url = editingWork ? `/api/our-works/${editingWork._id}` : "/api/our-works";
      const method = editingWork ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchWorks();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to save work");
      }
    } catch (error) {
      setError("Something went wrong while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/our-works/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchWorks();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredWorks = works.filter(w => 
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Portfolio Management</h1>
          <p className="text-muted-foreground">Manage your case studies and customer success stories.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="bg-background border border-border p-6 rounded-2xl">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Projects</p>
            <p className="text-3xl font-bold">{works.length}</p>
         </div>
         <div className="bg-background border border-border p-6 rounded-2xl">
            <p className="text-sm text-muted-foreground font-medium mb-1">Active Stories</p>
            <p className="text-3xl font-bold text-green-500">{works.filter(w => w.isActive).length}</p>
         </div>
         <div className="bg-background border border-border p-6 rounded-2xl">
            <p className="text-sm text-muted-foreground font-medium mb-1">Categories</p>
            <p className="text-3xl font-bold text-primary">{new Set(works.map(w => w.category)).size}</p>
         </div>
      </div>

      {/* Search & Filter */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search by title or category..." 
          className="w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Works List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorks.map((work) => {
            const IconComp = iconOptions.find(o => o.name === work.iconName)?.icon || Layout;
            return (
              <div key={work._id} className="group bg-background border border-border rounded-[2.5rem] overflow-hidden flex flex-col hover:border-primary/50 transition-all duration-500">
                <div className="relative aspect-video overflow-hidden">
                  <img src={work.image} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-border/50">
                      {work.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => handleOpenModal(work)} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(work._id)} className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{work.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">/{work.slug}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                    {work.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {work.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-medium text-muted-foreground">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${work.isActive ? 'text-green-500' : 'text-amber-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${work.isActive ? 'bg-green-500' : 'bg-amber-500'}`} />
                      {work.isActive ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">Order: {work.order}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-background border border-border rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{editingWork ? 'Edit Project' : 'New Project'}</h2>
                  <p className="text-sm text-muted-foreground">Fill in the details for the portfolio entry.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {error && (
                    <div className="lg:col-span-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Image Upload Area */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-bold mb-4">Project Cover Image</label>
                    <div className="relative aspect-video rounded-3xl border-2 border-dashed border-border hover:border-primary/50 transition-colors group overflow-hidden bg-muted/30">
                      {formData.image ? (
                        <>
                          <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer bg-white text-black px-6 py-2 rounded-xl font-bold text-sm">
                              Change Image
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                          {isUploading ? (
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                          ) : (
                            <>
                              <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                              <p className="font-bold">Click to upload cover image</p>
                              <p className="text-sm text-muted-foreground">High resolution landscape image recommended</p>
                            </>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Project Title</label>
                      <input 
                        required
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. EcoSphere Dashboard"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Category</label>
                      <input 
                        required
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g. Fintech, AI Solutions"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Tags (comma separated)</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          value={formData.tagsString}
                          onChange={(e) => setFormData(prev => ({ ...prev, tagsString: e.target.value }))}
                          placeholder="Next.js, Tailwind, MongoDB"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Icon Representation</label>
                      <div className="grid grid-cols-5 gap-3">
                        {iconOptions.map((opt) => (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, iconName: opt.name }))}
                            className={`aspect-square rounded-xl border flex items-center justify-center transition-all ${
                              formData.iconName === opt.name 
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                                : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            <opt.icon className="w-5 h-5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Display Order</label>
                      <input 
                        type="number"
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <div 
                            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                            className={`w-12 h-6 rounded-full transition-all relative ${formData.isActive ? 'bg-primary' : 'bg-muted'}`}
                          >
                             <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isActive ? 'left-7' : 'left-1'}`} />
                          </div>
                          <span className="text-sm font-bold">Visible in Portfolio</span>
                       </label>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-bold mb-2">Brief Description</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Highlight the core problem solved and the technology used..."
                    />
                  </div>

                  <div className="lg:col-span-2 flex justify-end gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="px-10 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {editingWork ? 'Update Project' : 'Create Project'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

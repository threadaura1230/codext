"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Zap, 
  Server, 
  Shield, 
  Cpu, 
  Globe, 
  MoreVertical,
  ExternalLink,
  Save,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Map icon names to Lucide components
const iconMap: Record<string, any> = {
  Zap,
  Server,
  Shield,
  Cpu,
  Globe
};

interface Offer {
  _id: string;
  title: string;
  description: string;
  iconName: string;
  image?: string;
  features: string[];
  slug: string;
  isActive: boolean;
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconName: "Zap",
    image: "",
    features: ["", "", ""],
    slug: "",
    isActive: true
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/our-offers");
      const data = await res.json();
      setOffers(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch offers", err);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("subfolder", "offers");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.imageUrl }));
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (offer: Offer | null = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        title: offer.title,
        description: offer.description,
        iconName: offer.iconName,
        image: offer.image || "",
        features: offer.features.length > 0 ? [...offer.features] : ["", "", ""],
        slug: offer.slug,
        isActive: offer.isActive
      });
    } else {
      setEditingOffer(null);
      setFormData({
        title: "",
        description: "",
        iconName: "Zap",
        image: "",
        features: ["", "", ""],
        slug: "",
        isActive: true
      });
    }
    setIsModalOpen(true);
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === "title" && !editingOffer) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeatureField = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Validate features (remove empty)
    const cleanedFeatures = formData.features.filter(f => f.trim() !== "");
    const submitData = { ...formData, features: cleanedFeatures };

    try {
      const url = editingOffer ? `/api/our-offers/${editingOffer._id}` : "/api/our-offers";
      const method = editingOffer ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save offer");
      }

      await fetchOffers();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const res = await fetch(`/api/our-offers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOffers(prev => prev.filter(o => o._id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Offer Management</h1>
          <p className="text-muted-foreground">Create and manage premium services for the public site.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all w-full md:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add New Offer
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-background/50 backdrop-blur-xl border border-border p-6 rounded-3xl">
          <p className="text-sm text-muted-foreground font-medium mb-1">Total Offers</p>
          <p className="text-2xl font-bold">{offers.length}</p>
        </div>
        <div className="bg-background/50 backdrop-blur-xl border border-border p-6 rounded-3xl">
          <p className="text-sm text-muted-foreground font-medium mb-1">Active Offers</p>
          <p className="text-2xl font-bold text-green-500">{offers.filter(o => o.isActive).length}</p>
        </div>
        <div className="bg-background/50 backdrop-blur-xl border border-border p-6 rounded-3xl">
          <p className="text-sm text-muted-foreground font-medium mb-1">Drafts</p>
          <p className="text-2xl font-bold text-amber-500">{offers.filter(o => !o.isActive).length}</p>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-background/50 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-lg">Services List</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-muted/50 border border-border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Offer</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Features</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted" />
                      <p className="text-sm text-muted-foreground">Loading services...</p>
                    </div>
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-muted-foreground">No offers found. Create your first one!</p>
                  </td>
                </tr>
              ) : (
                offers.map((offer) => {
                  const Icon = iconMap[offer.iconName] || Zap;
                  return (
                    <tr key={offer._id} className="group hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{offer.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{offer.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground">
                          /{offer.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-muted-foreground">
                          {offer.features.length} features
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          offer.isActive 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-amber-500/10 text-amber-500"
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", offer.isActive ? "bg-green-500" : "bg-amber-500")} />
                          {offer.isActive ? "Active" : "Draft"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(offer)}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(offer._id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-background rounded-[32px] border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                <div>
                  <h2 className="text-2xl font-bold">{editingOffer ? "Edit Offer" : "Create New Offer"}</h2>
                  <p className="text-sm text-muted-foreground">Fill in the details for your premium service bundle.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-muted transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-6">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Title</label>
                    <input 
                      required
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Cloud Infrastructure"
                      className="w-full bg-muted/30 border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Slug</label>
                    <input 
                      required
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="e.g. cloud-infrastructure"
                      className="w-full bg-muted/30 border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Description</label>
                  <textarea 
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Briefly describe what this offer includes..."
                    rows={3}
                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold ml-1">Service Image</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="relative group aspect-video bg-muted/30 border-2 border-dashed border-border rounded-3xl overflow-hidden flex flex-col items-center justify-center transition-all hover:bg-muted/50">
                      {formData.image ? (
                        <>
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <label className="p-2 bg-white text-black rounded-lg cursor-pointer hover:bg-white/90 transition-all">
                                <Edit2 className="w-4 h-4" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                             </label>
                             <button 
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, image: "" }))}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                              <p className="text-xs text-muted-foreground font-medium">Uploading...</p>
                            </div>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                                <Plus className="w-6 h-6" />
                              </div>
                              <p className="text-xs font-bold text-muted-foreground">Click to upload image</p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1">PNG, JPG or WEBP</p>
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                          )}
                        </>
                      )}
                    </div>
                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 self-stretch flex flex-col justify-center">
                       <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Pro Tip</p>
                       <p className="text-sm text-muted-foreground leading-relaxed">
                         Upload a high-quality image that represents this service. Images are displayed in the list view and detail pages to improve conversion.
                       </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Icon</label>
                    <select 
                      name="iconName"
                      value={formData.iconName}
                      onChange={handleInputChange}
                      className="w-full bg-muted/30 border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="Zap">Zap (General)</option>
                      <option value="Server">Server (Infrastructure)</option>
                      <option value="Shield">Shield (Security)</option>
                      <option value="Cpu">Cpu (AI/Tech)</option>
                      <option value="Globe">Globe (Network)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Status</label>
                    <div className="flex items-center gap-4 h-[58px]">
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, isActive: true }))}
                        className={cn(
                          "flex-1 h-full rounded-2xl border transition-all font-bold text-sm",
                          formData.isActive 
                            ? "bg-green-500/10 border-green-500/50 text-green-500 shadow-sm" 
                            : "bg-muted/30 border-border text-muted-foreground"
                        )}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, isActive: false }))}
                        className={cn(
                          "flex-1 h-full rounded-2xl border transition-all font-bold text-sm",
                          !formData.isActive 
                            ? "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-sm" 
                            : "bg-muted/30 border-border text-muted-foreground"
                        )}
                      >
                        Draft
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-sm font-bold">Included Features</label>
                    <button 
                      type="button"
                      onClick={addFeatureField}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Feature
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-3">
                        <input 
                          value={feature}
                          onChange={(e) => handleFeatureChange(idx, e.target.value)}
                          placeholder={`Feature #${idx + 1}`}
                          className="flex-1 bg-muted/30 border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        />
                        <button 
                          type="button"
                          onClick={() => removeFeatureField(idx)}
                          className="p-3 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-[2] px-6 py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {editingOffer ? "Update Offer" : "Create Offer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

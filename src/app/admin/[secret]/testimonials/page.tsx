"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit2, Trash2, Star, User, 
  Check, X, Image as ImageIcon, Loader2, 
  Save, AlertCircle, Quote
} from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    avatar: "",
    rating: 5,
    isActive: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    setError("");
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        avatar: testimonial.avatar,
        rating: testimonial.rating,
        isActive: testimonial.isActive
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: "",
        role: "",
        content: "",
        avatar: "",
        rating: 5,
        isActive: true
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
    uploadData.append("subfolder", "avatars");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, avatar: data.imageUrl }));
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

    try {
      const url = editingTestimonial ? `/api/testimonials/${editingTestimonial._id}` : "/api/testimonials";
      const method = editingTestimonial ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTestimonials();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to save testimonial");
      }
    } catch (error) {
      setError("Something went wrong while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Customer Testimonials</h1>
          <p className="text-muted-foreground">Manage and showcase social proof for your platform.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" /> New Testimonial
        </button>
      </div>

      {/* Search Header */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search by name or company..." 
          className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 opacity-50">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="font-bold">Fetching social proof...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredTestimonials.map((testimonial) => (
              <motion.div 
                layout
                key={testimonial._id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-background border border-border rounded-[2rem] p-8 flex flex-col hover:border-primary/50 transition-all duration-500 relative"
              >
                <div className="absolute top-8 right-8 text-muted/10 group-hover:text-primary/10 transition-colors">
                   <Quote className="w-12 h-12" />
                </div>
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                  ))}
                </div>

                <p className="text-muted-foreground italic mb-8 flex-1 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
                     <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold leading-none mb-1">{testimonial.name}</h3>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex gap-3">
                    <button onClick={() => handleOpenModal(testimonial)} className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-white transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(testimonial._id)} className="p-2 bg-muted rounded-lg hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${testimonial.isActive ? 'text-green-500' : 'text-amber-500'}`}>
                    {testimonial.isActive ? 'ACTIVE' : 'DRAFT'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-background border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                  <p className="text-sm text-muted-foreground">Capture and manage customer reviews.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[70vh]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex justify-center mb-8">
                     <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-dashed border-border group-hover:border-primary/50 transition-colors">
                           {formData.avatar ? (
                              <img src={formData.avatar} className="w-full h-full object-cover" alt="Preview" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground italic text-[10px] text-center px-2">
                                 {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Upload Photo"}
                              </div>
                           )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                           <ImageIcon className="w-4 h-4" />
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Customer Name</label>
                      <input 
                        required
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Role / Company</label>
                      <input 
                        required
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="e.g. CEO at TechFlow"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Rating (1-5)</label>
                    <div className="flex gap-4">
                       {[1, 2, 3, 4, 5].map(star => (
                         <button
                           key={star}
                           type="button"
                           onClick={() => setFormData(p => ({ ...p, rating: star }))}
                           className={`flex-1 py-3 rounded-xl border transition-all font-bold ${formData.rating === star ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/30 border-border text-muted-foreground'}`}
                         >
                           {star} ★
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Review Content</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none italic"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="What does the customer have to say?..."
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
                        <span className="text-sm font-bold uppercase tracking-widest">Active Review</span>
                     </label>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-8 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="flex-[2] px-10 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {editingTestimonial ? 'Update' : 'Publish Review'}
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

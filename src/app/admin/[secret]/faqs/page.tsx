"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit2, Trash2, HelpCircle, 
  Check, X, Loader2, Save, AlertCircle, 
  ChevronDown, ChevronUp, GripVertical
} from "lucide-react";

interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/faqs");
      const data = await res.json();
      setFaqs(data);
    } catch (error) {
      console.error("Failed to fetch FAQs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (faq?: Faq) => {
    setError("");
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        isActive: faq.isActive
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: "",
        answer: "",
        order: faqs.length,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const url = editingFaq ? `/api/faqs/${editingFaq._id}` : "/api/faqs";
      const method = editingFaq ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to save FAQ");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (res.ok) fetchFaqs();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Help Center Management</h1>
          <p className="text-muted-foreground font-medium">Control the frequently asked questions displayed to your users.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" /> New Question
        </button>
      </div>

      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search for questions or answers..." 
          className="w-full bg-background border border-border rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 opacity-50">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="font-bold tracking-widest uppercase text-xs">Syncing knowledge base...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <motion.div 
                layout
                key={faq._id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-background border border-border rounded-3xl p-6 group hover:border-primary/50 transition-all duration-300 shadow-sm"
              >
                 <div className="flex items-start gap-6">
                    <div className="p-3 bg-muted rounded-xl text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                       <HelpCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h3 className="text-lg font-bold mb-2 pr-24 leading-tight">{faq.question}</h3>
                       <p className="text-muted-foreground text-sm line-clamp-2 italic">{faq.answer}</p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleOpenModal(faq)} className="p-3 bg-muted rounded-xl hover:bg-primary hover:text-white transition-all text-muted-foreground">
                          <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(faq._id)} className="p-3 bg-muted rounded-xl hover:bg-red-500 hover:text-white transition-all text-muted-foreground">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
                 <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${faq.isActive ? 'text-green-500' : 'text-amber-500'}`}>
                          {faq.isActive ? 'Visible' : 'Hidden'}
                       </span>
                       <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                          Order: {faq.order}
                       </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                       Created {new Date(faq.createdAt).toLocaleDateString()}
                    </div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-background border border-border rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-border flex items-center justify-between bg-muted/20">
                <div>
                  <h2 className="text-3xl font-bold">{editingFaq ? 'Edit Question' : 'Add New Question'}</h2>
                  <p className="text-sm text-muted-foreground font-medium">Keep your help center clear and accurate.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 overflow-y-auto max-h-[60vh]">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">The Question</label>
                    <input 
                      required
                      className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                      value={formData.question}
                      onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="e.g. How do I upgrade my plan?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">The Answer</label>
                    <textarea 
                      required
                      rows={6}
                      className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
                      value={formData.answer}
                      onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="Provide a clear and concise explanation..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Display Order</label>
                       <input 
                         type="number"
                         className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                         value={formData.order}
                         onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                       />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Visibility</label>
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                          className={`w-full h-14 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-3 ${formData.isActive ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-muted/30 text-muted-foreground'}`}
                        >
                           {formData.isActive ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                           {formData.isActive ? 'Visible to Users' : 'Hidden from Users'}
                        </button>
                     </div>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 border-2 border-border rounded-[2rem] font-bold hover:bg-muted transition-all">
                      Discard Changes
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="flex-[2] py-5 bg-primary text-white rounded-[2rem] font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                      {editingFaq ? 'Apply Changes' : 'Publish Question'}
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

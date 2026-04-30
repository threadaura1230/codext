"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit2, Trash2, BookOpen, Clock, 
  Check, X, Image as ImageIcon, Loader2, 
  Tag, ExternalLink, Save, AlertCircle, FileText,
  Star, User
} from "lucide-react";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  isFeatured: boolean;
  isActive: boolean;
  author: string;
  slug: string;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Engineering",
    excerpt: "",
    content: "",
    image: "",
    readTime: "5 min read",
    isFeatured: false,
    isActive: true,
    author: "Admin",
    slug: ""
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog?: Blog) => {
    setError("");
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        category: blog.category,
        excerpt: blog.excerpt,
        content: blog.content,
        image: blog.image,
        readTime: blog.readTime,
        isFeatured: blog.isFeatured,
        isActive: blog.isActive,
        author: blog.author,
        slug: blog.slug
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        category: "Engineering",
        excerpt: "",
        content: "",
        image: "",
        readTime: "5 min read",
        isFeatured: false,
        isActive: true,
        author: "Admin",
        slug: ""
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
    uploadData.append("subfolder", "blogs");

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

    try {
      const url = editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to save blog post");
      }
    } catch (error) {
      setError("Something went wrong while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gradient">Blog Management</h1>
          <p className="text-muted-foreground font-medium">Share your stories, updates, and technical insights with the world.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-2xl transition-all"
        >
          <Plus className="w-5 h-5" /> New Article
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         {[
           { label: "Total Posts", value: blogs.length, color: "text-foreground" },
           { label: "Published", value: blogs.filter(b => b.isActive).length, color: "text-green-500" },
           { label: "Featured", value: blogs.filter(b => b.isFeatured).length, color: "text-amber-500" },
           { label: "Drafts", value: blogs.filter(b => !b.isActive).length, color: "text-muted-foreground" }
         ].map((stat, i) => (
           <div key={i} className="bg-background border border-border/50 p-6 rounded-3xl backdrop-blur-xl shadow-sm">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
           </div>
         ))}
      </div>

      {/* Search Header */}
      <div className="relative mb-8 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search articles by title, author, or category..." 
          className="w-full bg-background border border-border rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="font-bold">Syncing with editorial desk...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredBlogs.map((blog) => (
              <motion.div 
                layout
                key={blog._id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-background border border-border/50 rounded-[2.5rem] overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-4 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      {blog.category}
                    </span>
                    {blog.isFeatured && (
                      <span className="px-3 py-1.5 bg-amber-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-white" /> Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => handleOpenModal(blog)} className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(blog._id)} className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {blog.author}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {blog.readTime}</div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-8 flex-1 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-border/30">
                    <span className={`flex items-center gap-2 text-xs font-black tracking-widest uppercase ${blog.isActive ? 'text-green-500' : 'text-amber-500'}`}>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${blog.isActive ? 'bg-green-500' : 'bg-amber-500'}`} />
                      {blog.isActive ? 'LIVE' : 'DRAFT'}
                    </span>
                    <Link href={`/blog/${blog.slug}`} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Editorial Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-5xl bg-background border border-border/50 rounded-[3rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            >
              <div className="p-8 md:p-10 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{editingBlog ? 'Edit Article' : 'Draft New Article'}</h2>
                    <p className="text-sm text-muted-foreground font-medium">Create high-quality content for your audience.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 md:p-10 overflow-y-auto flex-1">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {error && (
                    <div className="lg:col-span-3 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-4">
                      <AlertCircle className="w-6 h-6 flex-shrink-0" />
                      <span className="font-bold">{error}</span>
                    </div>
                  )}

                  {/* Left Column: Editor */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Article Title</label>
                      <input 
                        required
                        className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-xl"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Mastering the Art of Digital Transformation..."
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Short Excerpt</label>
                      <textarea 
                        required
                        rows={3}
                        className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium resize-none text-sm leading-relaxed"
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="A brief summary that hooks the reader..."
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1 flex justify-between">
                         Full Content (Markdown Supported)
                         <span className="text-[10px] text-primary underline cursor-pointer">Preview Mode</span>
                      </label>
                      <textarea 
                        required
                        rows={12}
                        className="w-full bg-muted/30 border border-border rounded-[2rem] px-6 py-6 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm leading-relaxed"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Start writing your masterpiece here..."
                      />
                    </div>
                  </div>

                  {/* Right Column: Settings */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Cover Image</label>
                      <div className="relative aspect-video rounded-[2rem] border-2 border-dashed border-border hover:border-primary/50 transition-colors group overflow-hidden bg-muted/20">
                        {formData.image ? (
                          <>
                            <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <label className="cursor-pointer bg-white text-black px-6 py-2 rounded-xl font-bold text-xs shadow-xl">
                                Replace
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                              </label>
                            </div>
                          </>
                        ) : (
                          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                            {isUploading ? (
                              <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            ) : (
                              <>
                                <ImageIcon className="w-10 h-10 text-muted-foreground mb-3" />
                                <p className="font-bold text-sm">Upload Cover</p>
                              </>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6 bg-muted/20 p-8 rounded-[2rem] border border-border/50">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                          <select 
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none font-bold text-sm appearance-none cursor-pointer"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          >
                            <option>Engineering</option>
                            <option>Product Update</option>
                            <option>Security</option>
                            <option>Culture</option>
                            <option>Design</option>
                          </select>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Read Time</label>
                          <input 
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none font-bold text-sm"
                            value={formData.readTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                            placeholder="e.g. 5 min read"
                          />
                       </div>

                       <div className="flex flex-col gap-4 pt-2">
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <input 
                               type="checkbox" 
                               className="hidden" 
                               checked={formData.isFeatured} 
                               onChange={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))} 
                             />
                             <div className={`w-12 h-6 rounded-full transition-all relative ${formData.isFeatured ? 'bg-amber-500' : 'bg-muted-foreground/30'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isFeatured ? 'left-7' : 'left-1'}`} />
                             </div>
                             <span className="text-xs font-bold uppercase tracking-wider">Feature Post</span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group">
                             <div 
                               onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                               className={`w-12 h-6 rounded-full transition-all relative ${formData.isActive ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
                             >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isActive ? 'left-7' : 'left-1'}`} />
                             </div>
                             <span className="text-xs font-bold uppercase tracking-wider">Publish Live</span>
                          </label>
                       </div>
                    </div>

                    <div className="pt-4 space-y-4">
                       <button 
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        {editingBlog ? 'Update Post' : 'Publish Article'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="w-full py-4 bg-muted text-foreground rounded-2xl font-bold text-sm hover:bg-muted/80 transition-all"
                      >
                        Cancel Draft
                      </button>
                    </div>
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

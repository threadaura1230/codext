"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Loader2, Search } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  slug: string;
  isFeatured: boolean;
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

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

  const featuredPost = blogs.find(b => b.isFeatured) || blogs[0];
  const otherPosts = blogs.filter(b => b._id !== featuredPost?._id);
  
  const categories = ["All", ...Array.from(new Set(blogs.map(b => b.category)))];

  const filteredPosts = filter === "All" 
    ? otherPosts 
    : otherPosts.filter(p => p.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Curating latest insights...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      {/* Blog Hero */}
      <section className="relative pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-bl-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Insights & <span className="text-gradient">Resources</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay up to date with the latest product updates, industry trends, and deep dives from the Codext engineering team.
            </p>
          </motion.div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <Link href={`/blog/${featuredPost.slug}`} className="relative block bg-background border border-border/50 rounded-[2.5rem] overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="h-72 md:h-auto bg-muted relative overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-8 left-8">
                     <span className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-xl">
                        FEATURED
                     </span>
                  </div>
                </div>
                <div className="p-8 md:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                      {featuredPost.category}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                       <Clock className="w-4 h-4" /> {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 group-hover:text-primary transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-10 line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all">
                    Read Full Article <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <h2 className="text-4xl font-bold tracking-tight">Latest <span className="text-primary">Articles</span></h2>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    filter === cat 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-[3rem]">
               <p className="text-muted-foreground font-medium">New insights are currently being written. Stay tuned!</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post) => (
                  <motion.div
                    layout
                    key={post._id}
                    variants={cardVariants}
                  >
                    <Link href={`/blog/${post.slug}`} className="group cursor-pointer flex flex-col h-full bg-background border border-border/50 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {post.readTime}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mb-8 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all mt-auto">
                           Full Story <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filteredPosts.length > 9 && (
            <div className="mt-20 flex justify-center">
              <button className="px-10 py-5 rounded-2xl font-bold bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-2xl transition-all">
                Load More Insights
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

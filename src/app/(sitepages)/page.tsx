"use client";

import React, { useEffect, useState } from "react";
import Hero from "@/sitepages/components/home/Hero";
import Benefits from "@/sitepages/components/home/Benefits";
import Features from "@/sitepages/components/home/Features";
import Testimonials from "@/sitepages/components/home/Testimonials";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Loader2 } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  category: string;
  image: string;
  slug: string;
  createdAt: string;
}

export default function HomePage() {
  const [recentPosts, setRecentPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        // Take the first 3 posts
        setRecentPosts(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch recent posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentPosts();
  }, []);

  return (
    <>
      <Hero />
      <Benefits />
      <Features />
      <Testimonials />
      
      {/* Blog Section */}
      <section className="py-32 px-6 bg-muted/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/5 rounded-tr-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                 Latest from our <span className="text-gradient">Blog</span>
              </h2>
              <p className="text-muted-foreground max-w-lg text-lg font-medium leading-relaxed">
                 Stay updated with the latest insights from our engineering and product teams.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/blog" className="flex items-center gap-3 font-black uppercase tracking-widest text-sm text-primary group transition-all">
                View All Posts <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
               <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
               <p className="font-bold tracking-widest uppercase text-xs">Syncing editorial feed...</p>
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-[3rem]">
               <p className="text-muted-foreground font-bold">New insights are coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <AnimatePresence>
                {recentPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/blog/${post.slug}`} className="group block bg-background border border-border/50 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden">
                        <img src={post.image} alt={post.title} className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-border/50">
                             {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                          <Calendar className="w-3.5 h-3.5 text-primary" /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <h3 className="font-bold text-xl mb-6 group-hover:text-primary transition-colors line-clamp-2 leading-tight flex-1">
                           {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                          Full Story <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

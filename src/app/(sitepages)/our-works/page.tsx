"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink, Code2, Rocket, Layout, Database, Globe, Loader2 } from "lucide-react";

// Icon mapping
const iconMap: Record<string, any> = {
  Layout,
  Code2,
  Rocket,
  Database,
  Globe
};

interface Work {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
  tags: string[];
  iconName: string;
}

export default function OurWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

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

  const categories = ["All", ...Array.from(new Set(works.map(w => w.category)))];

  const filteredProjects = filter === "All" 
    ? works 
    : works.filter(p => p.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Fetching portfolio masterpieces...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Crafting Digital <span className="text-gradient">Excellence</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Explore our portfolio of high-impact projects where technology meets strategy to solve complex business challenges at scale.
          </p>
        </motion.div>
      </section>

      {/* Filter Section */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                filter === cat 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/30" 
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-muted rounded-[3rem]">
               <p className="text-muted-foreground">New case studies are being drafted. Check back soon!</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => {
                  const Icon = iconMap[project.iconName] || Layout;
                  return (
                    <motion.div
                      key={project._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="group relative bg-background border border-border/50 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                    >
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                           <Link href={`/our-works/${project.slug}`} className="w-full py-3 bg-white text-black rounded-xl font-bold text-center flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              View Case Study <ExternalLink className="w-4 h-4" />
                           </Link>
                        </div>
                        <div className="absolute top-6 left-6 z-20">
                          <span className="px-4 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-bold rounded-full shadow-lg">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-4">
                           <Icon className="w-5 h-5 text-primary" />
                           <div className="flex gap-2">
                              {project.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{tag}</span>
                              ))}
                           </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-8">
                          {project.description}
                        </p>
                        <Link href={`/our-works/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                          Full Details <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to build your next big thing?</h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            From architecture to implementation, we provide the technical expertise to turn your vision into a market-leading product.
          </p>
          <Link href="/contact" className="px-10 py-5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-2xl transition-all inline-block">
            Start a Project with Us
          </Link>
        </div>
      </section>
    </div>
  );
}

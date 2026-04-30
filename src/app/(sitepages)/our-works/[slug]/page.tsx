"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Check, ArrowRight, Code2, Rocket, Layout, Database, Globe, Loader2, Calendar, Tag } from "lucide-react";

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
  createdAt: string;
}

export default function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        fetchWork(resolvedParams.slug);
      } catch (err) {
        console.error("Failed to resolve params", err);
        setLoading(false);
      }
    };
    resolveParams();
  }, [params]);

  const fetchWork = async (slug: string) => {
    try {
      const res = await fetch(`/api/our-works/by-slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setWork(data);
      }
    } catch (err) {
      console.error("Failed to fetch work detail", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading case study details...</p>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">We couldn't find the case study you're looking for.</p>
        <Link href="/our-works" className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const Icon = iconMap[work.iconName] || Layout;

  return (
    <div className="min-h-screen pb-24 pt-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <Link 
          href="/our-works" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                {work.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(work.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              {work.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-10">
              {work.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
               {work.tags.map(tag => (
                 <div key={tag} className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl border border-border/50 text-sm font-bold">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    {tag}
                 </div>
               ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center gap-2">
                Visit Live Site <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all">
                View GitHub
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-20 rounded-full" />
            <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-border shadow-2xl">
              <img 
                src={work.image} 
                alt={work.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          </motion.div>
        </div>

        {/* Project Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "The Challenge", desc: "Building a scalable infrastructure that could handle peak traffic during global events while maintaining zero downtime." },
             { title: "The Solution", desc: "Implemented a multi-cloud strategy with automated failover and intelligent load balancing using our proprietary AI layer." },
             { title: "The Impact", desc: "Achieved a 45% reduction in latency and successfully handled 10x traffic growth within the first quarter post-launch." }
           ].map((item, i) => (
             <div key={i} className="p-10 bg-muted/30 rounded-[2.5rem] border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                   <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </section>
      </div>
    </div>
  );
}

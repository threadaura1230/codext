"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Check, ArrowRight, Shield, Zap, Globe, Cpu, Server, Loader2 } from "lucide-react";

// Icon mapping
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
}

export default function OfferDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
        fetchOffer(resolvedParams.slug);
      } catch (err) {
        console.error("Failed to resolve params", err);
        setLoading(false);
      }
    };
    resolveParams();
  }, [params]);

  const fetchOffer = async (slug: string) => {
    try {
      const res = await fetch(`/api/our-offers/by-slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setOffer(data);
      } else {
        console.error("Offer not found in API");
      }
    } catch (err) {
      console.error("Failed to fetch offer detail", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
          <Zap className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Offer Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">We couldn't find the service you're looking for. It might have been moved or removed.</p>
        <Link href="/our-offers" className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all">
          Back to All Offers
        </Link>
      </div>
    );
  }

  const Icon = iconMap[offer.iconName] || Zap;

  return (
    <div className="min-h-screen pb-24 pt-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/our-offers" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to All Offers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
              <Icon className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {offer.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10">
              {offer.description}
            </p>
            
            <div className="space-y-4 mb-10">
              {offer.features && offer.features.length > 0 ? (
                offer.features.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))
              ) : (
                /* Fallback features if none provided */
                [
                  "Enterprise-grade performance",
                  "24/7 Dedicated Support",
                  "Compliance-first architecture",
                  "Seamless API integrations"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all">
                Get Started with {offer.title}
              </button>
              <button className="px-8 py-4 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all">
                Download Datasheet
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-30 rounded-full animate-pulse" />
            
            {offer.image ? (
              <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-border shadow-2xl group">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-8 left-8">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                      <Icon className="w-6 h-6" />
                   </div>
                </div>
              </div>
            ) : (
              <div className="relative bg-background border border-border rounded-[2.5rem] p-10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold">Standard Plan</h3>
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-4xl font-bold mb-1">$199<span className="text-sm text-muted-foreground font-normal">/month</span></p>
                    <p className="text-sm text-muted-foreground">Billed annually ($2,388/year)</p>
                  </div>

                  <div className="space-y-6">
                     <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-primary"
                        />
                     </div>
                     <div className="flex justify-between text-xs font-bold text-muted-foreground">
                        <span>Usage: 7.5GB / 10GB</span>
                        <span>75%</span>
                     </div>
                  </div>

                  <div className="mt-12 p-6 bg-muted rounded-2xl border border-border/50">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border">
                           <Zap className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="font-bold">Next Milestone</p>
                           <p className="text-xs text-muted-foreground">Unlock 100GB Storage</p>
                        </div>
                     </div>
                     <button className="w-full py-3 bg-background text-foreground border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all">
                        Upgrade Now
                     </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Technical Deep Dive */}
        <section className="mt-32">
           <h2 className="text-3xl font-bold mb-12 text-center">Technical Deep Dive</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "High Availability", desc: "Redundant nodes across 3 availability zones." },
                { title: "Automated Backups", desc: "Point-in-time recovery for the last 30 days." },
                { title: "Smart Throttling", desc: "Prioritize critical traffic during peak hours." }
              ].map((box, i) => (
                <div key={i} className="p-8 bg-muted/30 rounded-3xl border border-border/50 hover:bg-muted/50 transition-colors">
                   <h4 className="font-bold mb-3">{box.title}</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">{box.desc}</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}

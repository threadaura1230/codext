"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Server, Shield, Cpu, Globe, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Pricing from "@/sitepages/components/home/Pricing";

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function OffersPage() {
  const [services, setServices] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/our-offers");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="pt-16 pb-24 px-6 text-center bg-gradient-to-b from-accent/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Premium <span className="text-gradient">Solutions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Scale your business with our enterprise-grade services and flexible pricing plans designed for modern high-growth teams.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
            >
              View Pricing
            </button>
            <Link href="/contact" className="px-8 py-4 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all">
              Talk to Sales
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Services List Section */}
      <section className="py-24 px-6 min-h-[400px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Capabilities</h2>
            <p className="text-muted-foreground">The technical foundation that powers your success.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground font-medium animate-pulse">Loading premium services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-muted rounded-[40px]">
              <p className="text-muted-foreground">Our new offers are coming soon. Stay tuned!</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {services.map((service) => {
                const Icon = iconMap[service.iconName] || Zap;
                return (
                  <motion.div
                    key={service._id}
                    variants={itemVariants}
                    className="group p-2 rounded-[2.5rem] bg-background border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 bg-muted">
                      {service.image ? (
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                          <Icon className="w-12 h-12 text-primary/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="px-6 pb-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
                        {service.description}
                      </p>
                      <ul className="space-y-3 mb-8 flex-1">
                        {service.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link href={`/our-offers/${service.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <div id="pricing">
        <Pricing />
      </div>

      {/* Value Proposition Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">Why choose our premium bundles?</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Our bundles are curated to provide the best value for startups at different stages of their journey. From seed-funded teams to enterprise scale, we have an offer that fits your growth trajectory.
          </p>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-muted/50 rounded-2xl border border-border/50">
                <p className="text-2xl font-bold text-primary mb-1">30% Off</p>
                <p className="text-sm text-muted-foreground font-medium">Annual Billing</p>
             </div>
             <div className="p-6 bg-muted/50 rounded-2xl border border-border/50">
                <p className="text-2xl font-bold text-primary mb-1">Free Migration</p>
                <p className="text-sm text-muted-foreground font-medium">Limited Time</p>
             </div>
          </div>
        </div>
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-background rounded-3xl p-12 border border-border aspect-video flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 z-0" />
                <div className="text-center relative z-10">
                    <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Startup special</p>
                    <h3 className="text-5xl font-bold mb-4">Save $500+</h3>
                    <p className="text-muted-foreground text-lg">On your first year of professional hosting</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}

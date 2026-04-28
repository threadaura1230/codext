"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Headset } from "lucide-react";

const Features = () => {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Provides best <span className="text-gradient">Feature</span> <br />
            for customer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We offer the most comprehensive set of features to ensure your 
            business stays ahead of the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex gap-6 p-6 rounded-3xl bg-muted/50 border border-border/50">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground mb-2">Fully Secured</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Enterprise-grade encryption and security protocols to keep your data safe and compliant.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-6 rounded-3xl bg-muted/50 border border-border/50">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <Headset className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground mb-2">24/7 Support</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our dedicated team is always available to help you with any issues or questions you might have.
                </p>
              </div>
            </div>

            <ul className="space-y-4 pt-4">
              {["Real-time analytics", "Unlimited integrations", "Custom domain support"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-soft p-8 rounded-[40px] border border-primary/10">
              <Image
                src="/assets/hero-illustration.png" // Reusing or could use another one
                alt="Feature Illustration"
                width={600}
                height={500}
                className="rounded-2xl shadow-lg transform rotate-3"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;

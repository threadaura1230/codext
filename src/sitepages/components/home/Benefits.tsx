"use client";

import React from "react";
import { Shield, Settings, Zap } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Very fast & Secure",
    description: "Our infrastructure is built for speed and enterprise-grade security.",
    icon: Zap,
    color: "bg-blue-500",
  },
  {
    title: "Always customization",
    description: "Tailor every aspect of the system to fit your unique business needs.",
    icon: Settings,
    color: "bg-purple-500",
  },
  {
    title: "Smart contract",
    description: "Built-in smart contract capabilities for automated business logic.",
    icon: Shield,
    color: "bg-indigo-500",
  },
];

const Benefits = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-border/50 group"
            >
              <div className={`${benefit.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

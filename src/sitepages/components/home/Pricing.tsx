"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../layouts/utils";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Start up",
      price: billingCycle === "monthly" ? "10" : "99",
      description: "Perfect for small teams and startups starting their journey.",
      features: ["Up to 5 users", "Basic Analytics", "24/7 Email Support", "1GB Storage"],
      buttonText: "Get Started",
      highlight: false,
    },
    {
      name: "Classic",
      price: billingCycle === "monthly" ? "30" : "299",
      description: "Our most popular plan for growing businesses.",
      features: ["Up to 20 users", "Advanced Analytics", "Priority Support", "10GB Storage", "Custom Branding"],
      buttonText: "Get Started",
      highlight: true,
    },
    {
      name: "Premium",
      price: billingCycle === "monthly" ? "49" : "499",
      description: "Enterprise features for large scale operations.",
      features: ["Unlimited users", "Custom Reporting", "Dedicated Manager", "100GB Storage", "API Access"],
      buttonText: "Get Started",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Choose your best <br />
            <span className="text-gradient">pricing plan</span>
          </h2>
          
          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn("text-sm font-medium", billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-14 h-7 bg-border rounded-full relative p-1 transition-colors hover:bg-primary/20"
            >
              <div
                className={cn(
                  "w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300",
                  billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium", billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground")}>
              Yearly <span className="text-primary text-xs ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "p-8 rounded-[32px] border transition-all hover:shadow-2xl",
                plan.highlight 
                  ? "bg-gradient-premium text-white border-transparent scale-105 shadow-xl shadow-blue-500/20 z-10" 
                  : "bg-white text-foreground border-border"
              )}
            >
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className={cn("text-sm mb-8", plan.highlight ? "text-blue-100" : "text-muted-foreground")}>
                {plan.description}
              </p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className={cn("text-sm", plan.highlight ? "text-blue-100" : "text-muted-foreground")}>
                  /{billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </div>
              
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <Check className={cn("w-4 h-4 shrink-0", plan.highlight ? "text-white" : "text-primary")} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all transform active:scale-95",
                  plan.highlight
                    ? "bg-white text-primary hover:shadow-lg"
                    : "bg-muted text-foreground border border-border hover:bg-primary hover:text-white hover:border-transparent"
                )}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

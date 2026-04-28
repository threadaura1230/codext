"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
            Codext one of <br />
            the best system <br />
            in <span className="text-gradient">SAAS..</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
            Revolutionize your workflow with our advanced SaaS platform. 
            Secure, scalable, and designed for modern businesses.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#"
              className="bg-gradient-premium text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1"
            >
              Try & Get Started
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="px-8 py-4 rounded-full font-bold text-foreground border border-border hover:bg-muted transition-all"
            >
              Explore Features
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 w-full aspect-square md:aspect-[4/3] flex items-center justify-center">
            <Image
              src="/assets/hero-illustration.png"
              alt="Codext Platform"
              width={800}
              height={600}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 blur-3xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

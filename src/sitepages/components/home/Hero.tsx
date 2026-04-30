"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute   w-full h-full bg-primary/50 " />
      <div className="absolute  w-full h-full bg-accent/50 " />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
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
          <div className="relative z-10 w-full  flex items-center justify-center">
            <Image
              src="/assets/hero-illustration.png"
              alt="Codext Platform"
              width={650}
              height={450}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

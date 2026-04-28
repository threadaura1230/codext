import React from "react";
import Hero from "@/sitepages/components/home/Hero";
import Benefits from "@/sitepages/components/home/Benefits";
import Features from "@/sitepages/components/home/Features";
import Pricing from "@/sitepages/components/home/Pricing";
import Testimonials from "@/sitepages/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Features />
      <Pricing />
      <Testimonials />
    </>
  );
}

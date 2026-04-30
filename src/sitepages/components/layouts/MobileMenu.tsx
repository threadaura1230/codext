"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface NavLink {
  name: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  open: {
    opacity: 1,
    y: "0%",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const linkContainerVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const linkVariants: Variants = {
  closed: { opacity: 0, y: 20 },
  open: { opacity: 1, y: 0 },
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navLinks }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 pb-6 px-6 flex flex-col justify-between overflow-y-auto"
        >
          <motion.nav
            variants={linkContainerVariants}
            className="flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <motion.div key={link.name} variants={linkVariants}>
                <Link
                  href={link.href}
                  className="text-3xl font-bold text-foreground hover:text-primary transition-colors block"
                  onClick={onClose}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          <motion.div
            variants={linkVariants}
            className="mt-12 flex flex-col gap-4"
          >
            <Link
              href="#"
              className="bg-gradient-premium text-white px-8 py-4 rounded-xl text-center font-bold text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1"
              onClick={onClose}
            >
              Start Free Trial
            </Link>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Join thousands of forward-thinking companies.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;

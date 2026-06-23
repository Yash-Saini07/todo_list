"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden group hover:scale-110 active:scale-90 transition-transform duration-300"
            aria-label="Toggle Theme"
        >
            <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Sun Icon */}
                <motion.div
                    initial={false}
                    animate={{
                        y: theme === "light" ? 0 : 40,
                        opacity: theme === "light" ? 1 : 0,
                        rotate: theme === "light" ? 0 : 90
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute text-yellow-500"
                >
                    <Sun size={28} fill="currentColor" className="drop-shadow-lg" />
                </motion.div>

                {/* Moon Icon */}
                <motion.div
                    initial={false}
                    animate={{
                        y: theme === "dark" ? 0 : -40,
                        opacity: theme === "dark" ? 1 : 0,
                        rotate: theme === "dark" ? 0 : -90
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute text-blue-400"
                >
                    <Moon size={28} fill="currentColor" className="drop-shadow-lg" />
                </motion.div>

                {/* Ripple/Glow Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
        </button>
    );
}

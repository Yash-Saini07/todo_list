"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";

const TrashCan = ({ onClick, className = "" }) => {
    const [isHovered, setIsHovered] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        if (!isHovered) {
            // Trigger wobble animation when closing (hover ends)
            controls.start({
                rotate: [0, -10, 10, -5, 5, 0],
                transition: { duration: 0.5, ease: "easeInOut" },
            });
        }
    }, [isHovered, controls]);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative group flex items-center justify-center p-2 rounded-full hover:bg-red-50 focus:outline-none transition-colors ${className}`}
            aria-label="Delete"
        >
            <div className="relative w-6 h-6">
                {/* Lid */}
                <motion.div
                    className="absolute top-0 w-full"
                    initial={{ rotate: 0 }}
                    animate={{
                        rotate: isHovered ? 45 : 0,
                        y: isHovered ? -5 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ originX: 1, originY: 1 }} // Pivot from bottom-right (right hinge)
                >
                    {/* Lid Handle */}
                    <div className="mx-auto w-3 h-0.5 bg-red-500 rounded-t-sm" />
                    {/* Lid Top */}
                    <div className="w-[110%] -ml-[5%] h-1 mt-0.5 bg-red-500 rounded-t-lg" />
                </motion.div>

                {/* Bin Body */}
                <motion.div
                    animate={controls}
                    className="absolute bottom-0 w-full h-4 mt-1 bg-red-500 rounded-b-md flex justify-center items-end overflow-hidden"
                >
                    {/* Bin Stripes */}
                    <div className="w-0.5 h-3 bg-red-300/50 mx-0.5 mb-1 rounded-sm" />
                    <div className="w-0.5 h-3 bg-red-300/50 mx-0.5 mb-1 rounded-sm" />
                    <div className="w-0.5 h-3 bg-red-300/50 mx-0.5 mb-1 rounded-sm" />
                </motion.div>
            </div>
        </button>
    );
};

export default TrashCan;

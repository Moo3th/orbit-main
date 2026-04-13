'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function OrbitBackground() {
    const { isDark } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isIOS, setIsIOS] = useState(false);

    // CRITICAL: Detect iOS and disable all animations
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
        }
    }, []);

    // Handle mouse movement for parallax effect - skip on iOS
    useEffect(() => {
        if (isIOS) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isIOS]);

    const { scrollY } = useScroll();
    const smoothScroll = useSpring(scrollY, { stiffness: 50, damping: 20 });
    const rotate = useTransform(smoothScroll, [0, 5000], [0, 360]);

    // Brand colors
    const colors = {
        burgundy: '#7A1E2E',
        beige: '#E8DCCB',
        coolGray: '#A7A9AC',
    };

    // Extracted paths from public/logo/شعار المدار-01.svg
    // These represent the key geometric elements of the logo
    const logoPaths = [
        // Main curve 1
        "M665.36,278.94c0.13,0.03,0.36,0.07,0.49,0.13c2.02,0.9,7.26,6.75,9.25,8.79c20.59,20.98,35.8,46.62,44.35,74.74c13.47,44.46,9.95,95.47-12.15,136.69c-0.67,1.25-2.28,5.05-3.46,5.4c18.61-34.87,25.29-74.88,19.04-113.9c-5.88-35.76-22.58-68.87-47.85-94.85c-4.21-4.29-8.6-8.92-13.49-12.44C662.73,281.92,664.07,280.44,665.36,278.94z",
        // Main curve 2
        "M514.53,240.15l0.37,0.02c-35.01,6.61-67.33,23.31-92.96,48.06c-33.82,33.06-53.24,78.13-54.04,125.42l-5.14-0.06l-0.61-0.48c-0.03-0.29-0.05-0.59-0.06-0.88c-0.25-5.64,1.25-13.79,2.1-19.47c5.64-37.68,22.76-71.11,48.49-98.96c21.63-23.41,50.78-40.16,81.17-49.2C500.37,242.65,507.71,240.42,514.53,240.15z",
        // Inner detail 1
        "M639.64,273.92c4.9,2.74,9.6,6.89,13.93,10.49c22.76,18.83,40.23,43.27,50.69,70.9c11.55,30.39,14.21,63.44,7.66,95.29c-1.92,9.57-4.6,19.45-8.6,28.37l-0.24-0.24c10.24-31.38,13.68-57.43,7.7-90.13c-6.44-34.05-23.37-65.24-48.42-89.19c-8.09-7.65-16.92-14.14-26.07-20.45C637.26,277.18,638.48,275.56,639.64,273.92z",
        // Inner detail 2
        "M493.38,257.41l0.26-0.01c-0.07,0.4-4.29,1.7-5,1.95c-14.97,5.28-29.54,13.73-42.26,23.17c-37.24,27.82-61.17,69.93-66.01,116.17c-0.61,6.24-1.11,12.81-0.86,19.07c0.22,5.5,1.61,12.71,0.83,18.02c-1.14,0.73-2.94,0.62-4.28,0.69l-0.96,0.11l-0.42-0.67c-1.58-38.47,3.54-70.66,24.05-104.07c18.19-29.63,44.34-53.53,76.27-67.59C480.91,261.65,487.1,258.91,493.38,257.41z"
    ];

    // CRITICAL: Return simple static gradient on iOS
    if (isIOS) {
        return (
            <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3 dark:from-primary/5 dark:to-secondary/5" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 w-full h-full">

                {/* 1. Large Floating Echoes - Background Ambience */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={`echo-${i}`}
                        className="absolute top-1/2 left-1/2"
                        style={{
                            width: '120vh',
                            height: '120vh',
                            x: '-50%',
                            y: '-50%',
                            opacity: 0.03,
                        }}
                        animate={{
                            rotate: i % 2 === 0 ? 360 : -360,
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            rotate: { duration: 120 + i * 30, repeat: Infinity, ease: "linear" },
                            scale: { duration: 20, repeat: Infinity, ease: "easeInOut", delay: i * 5 }
                        }}
                    >
                        <svg viewBox="0 0 1080 1080" className="w-full h-full fill-current text-primary">
                            {logoPaths.map((d, idx) => (
                                <path key={idx} d={d} />
                            ))}
                        </svg>
                    </motion.div>
                ))}

                {/* 2. Path Tracing Animation - The "Living" Lines */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] opacity-20">
                    <svg viewBox="0 0 1080 1080" className="w-full h-full">
                        {logoPaths.map((d, i) => (
                            <motion.path
                                key={`trace-${i}`}
                                d={d}
                                fill="none"
                                stroke={i % 2 === 0 ? colors.burgundy : colors.beige}
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: [0, 1, 1, 0],
                                    opacity: [0, 1, 1, 0],
                                    pathOffset: [0, 0, 1, 1]
                                }}
                                transition={{
                                    duration: 10 + i * 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 1.5,
                                    times: [0, 0.4, 0.6, 1]
                                }}
                            />
                        ))}
                    </svg>
                </div>

                {/* 3. Interactive Parallax Layer */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-10"
                    animate={{
                        x: mousePosition.x * 40,
                        y: mousePosition.y * 40,
                    }}
                    transition={{ type: "spring", damping: 30, stiffness: 200 }}
                >
                    <svg viewBox="0 0 1080 1080" className="w-[60vh] h-[60vh]">
                        {logoPaths.map((d, i) => (
                            <path key={`parallax-${i}`} d={d} fill={i === 0 ? colors.burgundy : colors.coolGray} />
                        ))}
                    </svg>
                </motion.div>

                {/* 4. Particles traveling along paths (Simulated with rotation for performance) */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute top-1/2 left-1/2 w-[70vh] h-[70vh] border border-dashed border-primary/20 rounded-full"
                        style={{ x: '-50%', y: '-50%' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 40 + i * 10, repeat: Infinity, ease: "linear", delay: i * -5 }}
                    >
                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full blur-[1px]" />
                    </motion.div>
                ))}

            </div>
        </div>
    );
}

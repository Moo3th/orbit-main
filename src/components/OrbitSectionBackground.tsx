'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

interface OrbitSectionBackgroundProps {
    alignment?: 'left' | 'right' | 'center' | 'scattered' | 'split' | 'both';
    density?: 'low' | 'medium' | 'high';
}

export default function OrbitSectionBackground({
    alignment = 'center',
    density = 'medium'
}: OrbitSectionBackgroundProps) {
    const { isDark } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        setMounted(true);
        // CRITICAL: Detect iOS and disable all animations
        if (typeof window !== 'undefined') {
            setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
        }
    }, []);

    // Brand colors
    const colors = {
        burgundy: '#7A1E2E',
        beige: '#E8DCCB',
        coolGray: '#A7A9AC',
    };

    // Extracted paths from public/logo/شعار المدار-01.svg
    const logoPaths = [
        "M665.36,278.94c0.13,0.03,0.36,0.07,0.49,0.13c2.02,0.9,7.26,6.75,9.25,8.79c20.59,20.98,35.8,46.62,44.35,74.74c13.47,44.46,9.95,95.47-12.15,136.69c-0.67,1.25-2.28,5.05-3.46,5.4c18.61-34.87,25.29-74.88,19.04-113.9c-5.88-35.76-22.58-68.87-47.85-94.85c-4.21-4.29-8.6-8.92-13.49-12.44C662.73,281.92,664.07,280.44,665.36,278.94z",
        "M514.53,240.15l0.37,0.02c-35.01,6.61-67.33,23.31-92.96,48.06c-33.82,33.06-53.24,78.13-54.04,125.42l-5.14-0.06l-0.61-0.48c-0.03-0.29-0.05-0.59-0.06-0.88c-0.25-5.64,1.25-13.79,2.1-19.47c5.64-37.68,22.76-71.11,48.49-98.96c21.63-23.41,50.78-40.16,81.17-49.2C500.37,242.65,507.71,240.42,514.53,240.15z",
        "M639.64,273.92c4.9,2.74,9.6,6.89,13.93,10.49c22.76,18.83,40.23,43.27,50.69,70.9c11.55,30.39,14.21,63.44,7.66,95.29c-1.92,9.57-4.6,19.45-8.6,28.37l-0.24-0.24c10.24-31.38,13.68-57.43,7.7-90.13c-6.44-34.05-23.37-65.24-48.42-89.19c-8.09-7.65-16.92-14.14-26.07-20.45C637.26,277.18,638.48,275.56,639.64,273.92z",
        "M493.38,257.41l0.26-0.01c-0.07,0.4-4.29,1.7-5,1.95c-14.97,5.28-29.54,13.73-42.26,23.17c-37.24,27.82-61.17,69.93-66.01,116.17c-0.61,6.24-1.11,12.81-0.86,19.07c0.22,5.5,1.61,12.71,0.83,18.02c-1.14,0.73-2.94,0.62-4.28,0.69l-0.96,0.11l-0.42-0.67c-1.58-38.47,3.54-70.66,24.05-104.07c18.19-29.63,44.34-53.53,76.27-67.59C480.91,261.65,487.1,258.91,493.38,257.41z",
        "M614.29,273.24c26.23,12.8,48.41,32.61,64.09,57.23c24.37,38.05,29.97,80.33,20.39,124.14l-0.46,0.07c1.43-4.44,1.88-9.97,2.42-14.66c2.66-23.1,1.07-45.88-6-68.09c-11.23-34.65-34.28-64.25-65.13-83.62c-5.71-3.65-11.82-6.67-17.83-9.79C612.7,276.8,613.48,275,614.29,273.24z",
        "M475.71,277.15l0.31,0.25c-4.82,3.56-11.36,6.32-16.66,10.05c-22.63,15.9-41.6,36.85-53.45,61.99c-12.57,26.49-17.35,56.01-13.77,85.11c0.78,6.81,1.8,14.33,4.13,20.78c-1.78,0.29-3.47,0.84-5.18,1.37c-0.34-0.16-0.56-0.45-0.81-0.72c-7.13-26.33-4.64-60.02,3.99-85.82C408.06,328.9,436.88,296.49,475.71,277.15z"
    ];

    // Determine positioning styles based on alignment
    const getPositionStyles = (index: number, total: number) => {
        const baseStyles: any = { position: 'absolute' };

        switch (alignment) {
            case 'left':
                baseStyles.left = `${-15 + (index * 8)}%`;
                baseStyles.top = `${10 + (index * 15)}%`;
                baseStyles.transform = 'scale(1.5)';
                break;
            case 'right':
                baseStyles.right = `${-15 + (index * 8)}%`;
                baseStyles.top = `${10 + (index * 15)}%`;
                baseStyles.transform = 'scale(1.5)';
                break;
            case 'scattered':
                baseStyles.left = `${(index * 100 / total) + (Math.random() * 30 - 15)}%`;
                baseStyles.top = `${(Math.random() * 90)}%`;
                baseStyles.transform = `scale(${0.8 + Math.random() * 0.6})`;
                break;
            case 'split':
            case 'both':
                // Strictly alternating left/right for perfect balance
                if (index % 2 === 0) {
                    // Left side
                    baseStyles.left = `${-10 + (Math.random() * 5)}%`;
                    baseStyles.top = `${10 + (index * 12)}%`;
                } else {
                    // Right side
                    baseStyles.right = `${-10 + (Math.random() * 5)}%`;
                    baseStyles.top = `${10 + ((index - 1) * 12)}%`;
                }
                baseStyles.transform = 'scale(1.4)';
                break;
            case 'center':
            default:
                baseStyles.left = '50%';
                baseStyles.top = '50%';
                baseStyles.transform = 'translate(-50%, -50%) scale(1.2)';
                break;
        }

        return baseStyles;
    };

    // Increase default count to match logo complexity (6 lines)
    const itemCount = density === 'high' ? 12 : density === 'medium' ? 6 : 4;

    if (!mounted) return null;

    // CRITICAL: Return simple static gradient on iOS to prevent crashes
    if (isIOS) {
        return (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            {/* Soft Gradient Mask for Blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 dark:to-black/20 z-10" />

            {/* Flowing Lines - Multiple paths per item for richer background */}
            <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.25]">
                {[...Array(itemCount)].map((_, i) => (
                    <motion.div
                        key={`flow-${i}`}
                        className="absolute"
                        style={{
                            width: '800px',
                            height: '800px',
                            ...getPositionStyles(i, itemCount)
                        }}
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ 
                            opacity: 1,
                            rotate: [0, 360]
                        }}
                        transition={{ 
                            opacity: { duration: 1 },
                            rotate: { duration: 120 + i * 20, repeat: Infinity, ease: "linear" }
                        }}
                    >
                        <svg viewBox="0 0 1080 1080" className="w-full h-full">
                            {/* Draw multiple paths per item for richer, more dynamic background */}
                            {logoPaths.slice(0, 4).map((path, pathIndex) => {
                                const colorIndex = (i + pathIndex) % 3;
                                const strokeColor = colorIndex === 0 ? colors.burgundy : colorIndex === 1 ? colors.beige : colors.coolGray;
                                return (
                                    <motion.path
                                        key={`path-${i}-${pathIndex}`}
                                        d={path}
                                        fill="none"
                                        stroke={strokeColor}
                                        strokeWidth={pathIndex === 0 ? "3" : pathIndex === 1 ? "2.5" : "2"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                                        animate={{
                                            pathLength: [0, 0.9, 0.1, 0.9, 0],
                                            pathOffset: [0, 0.5, 1, 1.5, 2],
                                            opacity: [0, 0.9, 0.3, 0.9, 0]
                                        }}
                                        transition={{
                                            duration: 10 + Math.random() * 6 + (pathIndex * 2),
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: (i * 0.4) + (pathIndex * 0.3),
                                        }}
                                    />
                                );
                            })}
                        </svg>
                    </motion.div>
                ))}
            </div>

            {/* Central Particles - More dynamic and alive */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40 dark:opacity-50">
                {[...Array(20)].map((_, i) => {
                    const baseX = 50 + (Math.random() - 0.5) * 30;
                    const baseY = 50 + (Math.random() - 0.5) * 30;
                    const radius = 200 + Math.random() * 300;
                    const angle = (i * 360 / 20) + Math.random() * 30;
                    return (
                        <motion.div
                            key={`particle-${i}`}
                            className="absolute rounded-full blur-[1px]"
                            style={{
                                width: (Math.random() * 8 + 3) + 'px',
                                height: (Math.random() * 8 + 3) + 'px',
                                backgroundColor: i % 3 === 0 ? colors.burgundy : i % 3 === 1 ? colors.beige : colors.coolGray,
                                left: `${baseX}%`,
                                top: `${baseY}%`,
                            }}
                            animate={{
                                x: [0, Math.cos(angle * Math.PI / 180) * radius, 0],
                                y: [0, Math.sin(angle * Math.PI / 180) * radius, 0],
                                opacity: [0.3, 1, 0.3, 1, 0.3],
                                scale: [0.5, 1.5, 0.8, 1.3, 0.5],
                            }}
                            transition={{
                                duration: 8 + Math.random() * 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2,
                            }}
                        />
                    );
                })}
            </div>

            {/* Floating Echoes - More dynamic filled shapes with pulsing */}
            <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]">
                {[...Array(Math.ceil(itemCount / 2) + 2)].map((_, i) => (
                    <motion.div
                        key={`echo-${i}`}
                        className="absolute"
                        style={{
                            width: '1000px',
                            height: '1000px',
                            ...getPositionStyles(i, Math.ceil(itemCount / 2) + 2)
                        }}
                        animate={{
                            rotate: [0, 360, -360, 0],
                            scale: [1, 1.2, 0.9, 1.15, 1],
                            opacity: [0.04, 0.08, 0.05, 0.09, 0.04],
                        }}
                        transition={{
                            rotate: { duration: 120 + i * 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 15 + i * 3, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 },
                            opacity: { duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1 }
                        }}
                    >
                        <svg viewBox="0 0 1080 1080" className="w-full h-full fill-current text-primary">
                            {logoPaths.map((d, idx) => (
                                <motion.path 
                                    key={idx} 
                                    d={d}
                                    animate={{
                                        opacity: [0.3, 0.7, 0.3],
                                    }}
                                    transition={{
                                        duration: 6 + idx * 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: idx * 0.5
                                    }}
                                />
                            ))}
                        </svg>
                    </motion.div>
                ))}
            </div>

            {/* Additional flowing lines for extra depth */}
            <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.15]">
                {[...Array(Math.ceil(itemCount * 0.6))].map((_, i) => (
                    <motion.div
                        key={`extra-line-${i}`}
                        className="absolute"
                        style={{
                            width: '600px',
                            height: '600px',
                            left: `${20 + (i * 15)}%`,
                            top: `${15 + (i * 20)}%`,
                            transform: `scale(${0.8 + Math.random() * 0.4})`,
                        }}
                        animate={{
                            rotate: [0, 180, 360],
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                        }}
                        transition={{
                            rotate: { duration: 60 + i * 10, repeat: Infinity, ease: "linear" },
                            x: { duration: 20 + i * 5, repeat: Infinity, ease: "easeInOut" },
                            y: { duration: 25 + i * 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
                        }}
                    >
                        <svg viewBox="0 0 1080 1080" className="w-full h-full">
                            <motion.path
                                d={logoPaths[(i * 2) % logoPaths.length]}
                                fill="none"
                                stroke={i % 3 === 0 ? colors.burgundy : i % 3 === 1 ? colors.beige : colors.coolGray}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray="10 5"
                                animate={{
                                    strokeDashoffset: [0, 15],
                                    opacity: [0.4, 0.8, 0.4],
                                }}
                                transition={{
                                    strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear" },
                                    opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                }}
                            />
                        </svg>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

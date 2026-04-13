'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsMobile(mobile);
            // Disable animations on mobile for better scrolling performance
            setShouldAnimate(!mobile);
        }
    }, []);

    // On mobile, render without animations for smooth scrolling
    if (!shouldAnimate) {
        return (
            <div className={className}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

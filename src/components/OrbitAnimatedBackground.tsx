'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface OrbitAnimatedBackgroundProps {
  opacity?: number;
  speed?: number;
  size?: 'small' | 'medium' | 'large';
  color?: string; // Custom color override (e.g., 'rgba(255, 255, 255, 0.3)' for white on dark backgrounds)
}

export default function OrbitAnimatedBackground({ 
  opacity = 0.03,
  speed = 1,
  size = 'large',
  color
}: OrbitAnimatedBackgroundProps) {
  const { isDark } = useTheme();
  const [isIOS, setIsIOS] = useState(false);

  // CRITICAL: Detect iOS and completely disable animations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) || 
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    }
  }, []);
  
  const sizeMultiplier = size === 'small' ? 0.5 : size === 'medium' ? 0.75 : 1;
  const baseSize = 800 * sizeMultiplier;
  
  // Create multiple orbit rings with different speeds
  const orbits = [
    { radius: baseSize * 0.3, speed: 20 * speed, delay: 0 },
    { radius: baseSize * 0.4, speed: 25 * speed, delay: 2 },
    { radius: baseSize * 0.5, speed: 30 * speed, delay: 4 },
    { radius: baseSize * 0.6, speed: 35 * speed, delay: 6 },
    { radius: baseSize * 0.7, speed: 40 * speed, delay: 8 },
  ];

  const orbitColor = color || (isDark 
    ? 'rgba(122, 30, 46, 0.15)' // Primary burgundy for dark mode
    : 'rgba(122, 30, 46, 0.08)'); // Lighter burgundy for light mode

  // CRITICAL: Return simple static version on iOS
  if (isIOS) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden gpu-accelerated" style={{ zIndex: 0 }}>
      {/* Multiple orbit instances for seamless coverage */}
      {[
        { x: '20%', y: '20%' },
        { x: '80%', y: '30%' },
        { x: '50%', y: '70%' },
        { x: '10%', y: '80%' },
        { x: '90%', y: '90%' },
      ].map((position, instanceIndex) => (
        <motion.div
          key={instanceIndex}
          className="absolute"
          style={{
            left: position.x,
            top: position.y,
            width: baseSize,
            height: baseSize,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60 / speed,
            repeat: Infinity,
            ease: 'linear',
            delay: instanceIndex * 2,
          }}
        >
          {/* Orbit rings using div borders */}
          {orbits.map((orbit, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full border"
              style={{
                width: orbit.radius * 2,
                height: orbit.radius * 2,
                left: '50%',
                top: '50%',
                marginLeft: -orbit.radius,
                marginTop: -orbit.radius,
                borderColor: orbitColor,
                borderWidth: index === 2 ? '2px' : index === 1 || index === 3 ? '1.5px' : '1px',
                opacity: opacity,
                willChange: 'transform',
                transformOrigin: 'center',
              }}
              animate={{
                rotate: [0, -360],
                opacity: [opacity * 0.5, opacity, opacity * 0.5],
              }}
              transition={{
                duration: orbit.speed,
                repeat: Infinity,
                ease: 'linear',
                delay: orbit.delay,
              }}
            />
          ))}
          
          {/* Orbital lines connecting rings */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, lineIndex) => {
            const radian = (angle * Math.PI) / 180;
            const innerRadius = orbits[0].radius;
            const outerRadius = orbits[orbits.length - 1].radius;
            const length = outerRadius - innerRadius;
            
            return (
              <motion.div
                key={lineIndex}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${length}px`,
                  height: '1px',
                  background: `linear-gradient(to right, ${orbitColor}, transparent)`,
                  opacity: opacity * 0.6,
                  transformOrigin: 'left center',
                  willChange: 'transform',
                  marginLeft: innerRadius,
                }}
                animate={{
                  rotate: [angle, angle + 360],
                  opacity: [opacity * 0.3, opacity * 0.6, opacity * 0.3],
                }}
                transition={{
                  duration: 30 / speed,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: lineIndex * 0.5,
                }}
              />
            );
          })}
        </motion.div>
      ))}
      
      {/* Floating particles along orbits */}
      {[...Array(12)].map((_, particleIndex) => {
        const orbitIndex = particleIndex % orbits.length;
        const orbit = orbits[orbitIndex];
        const angle = (particleIndex * 30) % 360;
        
        return (
          <motion.div
            key={particleIndex}
            className="absolute rounded-full"
              style={{
                width: 4,
                height: 4,
                background: color 
                  ? color.replace(/[\d.]+\)$/, '0.6)') // Use custom color with higher opacity for particles
                  : (isDark ? 'rgba(122, 30, 46, 0.4)' : 'rgba(122, 30, 46, 0.2)'),
                left: '50%',
                top: '50%',
                transformOrigin: 'center',
                willChange: 'transform',
              }}
            animate={{
              rotate: [0, 360],
              x: [
                orbit.radius * Math.cos((angle * Math.PI) / 180),
                orbit.radius * Math.cos(((angle + 360) * Math.PI) / 180),
              ],
              y: [
                orbit.radius * Math.sin((angle * Math.PI) / 180),
                orbit.radius * Math.sin(((angle + 360) * Math.PI) / 180),
              ],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: orbit.speed,
              repeat: Infinity,
              ease: 'linear',
              delay: particleIndex * 0.3,
            }}
          />
        );
      })}
    </div>
  );
}


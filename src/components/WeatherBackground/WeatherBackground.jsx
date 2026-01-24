import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './WeatherBackground.module.css';

const PARTICLE_COUNT = 50;

export function WeatherBackground({ weatherMain, accentColor }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getGradientClass = () => {
    const themes = {
      Clear: styles.sunny,
      Clouds: styles.cloudy,
      Rain: styles.rain,
      Drizzle: styles.rain,
      Thunderstorm: styles.storm,
      Snow: styles.snow,
      Mist: styles.cloudy,
      Fog: styles.cloudy,
      Haze: styles.cloudy
    };
    return themes[weatherMain] || styles.default;
  };

  return (
    <div className={styles.background}>
      {/* Base gradient layer */}
      <motion.div
        className={`${styles.gradient} ${getGradientClass()}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Aurora glow effect */}
      <motion.div
        className={styles.aurora}
        style={{ '--accent': accentColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      />

      {/* Animated orbs */}
      <div className={styles.orbs}>
        <motion.div
          className={styles.orb}
          style={{ '--color': accentColor }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className={`${styles.orb} ${styles.orb2}`}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className={`${styles.orb} ${styles.orb3}`}
          animate={{
            x: [0, 60, 0],
            y: [0, 80, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Floating particles canvas */}
      <canvas ref={canvasRef} className={styles.particles} />

      {/* Noise texture overlay */}
      <div className={styles.noise} />

      {/* Vignette effect */}
      <div className={styles.vignette} />
    </div>
  );
}

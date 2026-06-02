import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export const ParticlesBg: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.05 + 0.02,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(initialParticles);

    let animationFrameId: number;
    const updateParticles = () => {
      setParticles((prev) =>
        prev.map((p) => {
          let nextY = p.y - p.speed;
          let nextX = p.x + Math.sin(nextY / 5) * 0.02;
          
          if (nextY < -5) {
            nextY = 105;
            nextX = Math.random() * 100;
          }
          
          return {
            ...p,
            y: nextY,
            x: nextX,
          };
        })
      );
      animationFrameId = requestAnimationFrame(updateParticles);
    };

    animationFrameId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-accent-gold/20 dark:bg-accent-gold/10"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
};

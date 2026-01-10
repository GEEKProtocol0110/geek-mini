"use client";

import { useEffect, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
  size: number;
}

export default function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: -20,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 5 + 5,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
      });
    }

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3,
            rotation: p.rotation + 5,
          }))
          .filter((p) => p.y < window.innerHeight)
      );
    }, 16);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

const SonarOrb = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Set canvas dimensions
    const width = 320;
    const height = 320;
    canvas.width = width * 2; // HiDPI
    canvas.height = height * 2;
    ctx.scale(2, 2);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw outer glowing halo aura
      const auraGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.35);
      auraGradient.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
      auraGradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
      auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Clip sphere boundary for interior liquid background & sine waves
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Sphere base gradient (Deep Purple to Magenta to Cyan top-highlight)
      const sphereGradient = ctx.createLinearGradient(
        centerX - radius * 0.5,
        centerY - radius,
        centerX + radius * 0.5,
        centerY + radius
      );
      sphereGradient.addColorStop(0, '#38bdf8'); // Cyan highlight
      sphereGradient.addColorStop(0.2, '#818cf8'); // Indigo
      sphereGradient.addColorStop(0.55, '#a855f7'); // Vibrant Purple
      sphereGradient.addColorStop(0.85, '#6b21a8'); // Deep Purple
      sphereGradient.addColorStop(1, '#3b0764'); // Dark Violet

      ctx.fillStyle = sphereGradient;
      ctx.fillRect(0, 0, width, height);

      // Sphere inner dark shadow depth
      const innerShadow = ctx.createRadialGradient(
        centerX, centerY, radius * 0.4,
        centerX, centerY, radius
      );
      innerShadow.addColorStop(0, 'rgba(0,0,0,0)');
      innerShadow.addColorStop(0.85, 'rgba(15, 7, 35, 0.4)');
      innerShadow.addColorStop(1, 'rgba(5, 2, 15, 0.8)');
      ctx.fillStyle = innerShadow;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw oscillating liquid sound wave lines inside sphere
      const waves = [
        { yOffset: -35, freq: 0.035, speed: 1.2, amp: 14, color: 'rgba(56, 189, 248, 0.85)', width: 2.5 },
        { yOffset: -18, freq: 0.045, speed: -1.5, amp: 18, color: 'rgba(255, 255, 255, 0.95)', width: 3 },
        { yOffset: 0, freq: 0.03, speed: 1.8, amp: 22, color: 'rgba(232, 121, 249, 0.9)', width: 3.5 },
        { yOffset: 18, freq: 0.04, speed: -1.3, amp: 16, color: 'rgba(192, 38, 211, 0.85)', width: 2.5 },
        { yOffset: 35, freq: 0.05, speed: 1.1, amp: 12, color: 'rgba(168, 85, 247, 0.75)', width: 2 }
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.width;
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = 12;

        const startX = centerX - radius;
        const endX = centerX + radius;

        for (let x = startX; x <= endX; x += 2) {
          // Modulation so wave tapers off towards the edges of the sphere
          const normalizedX = (x - startX) / (radius * 2);
          const edgeFactor = Math.sin(normalizedX * Math.PI); // 0 at edges, 1 in middle

          const y = centerY + wave.yOffset + 
            Math.sin(x * wave.freq + time * wave.speed) * wave.amp * edgeFactor +
            Math.cos(x * 0.02 - time * 0.8) * 6 * edgeFactor;

          if (x === startX) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      ctx.restore();

      // 4. Draw outer rim glowing edge ring (Neon edge highlight)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 15;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 20;
      ctx.stroke();

      // Reset shadow blur
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Soft pulsating glow background element */}
      <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-tr from-purple-600/30 via-fuchsia-500/20 to-cyan-400/30 blur-2xl animate-pulse" />
      
      {/* Liquid Wave Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: '320px', height: '320px' }}
        className="relative z-10 drop-shadow-[0_0_35px_rgba(168,85,247,0.5)] transition-transform duration-700 hover:scale-105"
      />
    </div>
  );
};

export default SonarOrb;

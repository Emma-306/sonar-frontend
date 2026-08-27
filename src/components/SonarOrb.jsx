import { useEffect, useRef } from "react";

const SonarOrb = ({ isPlaying = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrameId;
    let time = 0;

    // Smaller canvas
    const width = 220;
    const height = 220;

    // High DPI
    canvas.width = width * 2;
    canvas.height = height * 2;

    ctx.scale(2, 2);

    const centerX = width / 2;
    const centerY = height / 2;

    // Smaller sphere
    const radius = 82;

    const render = () => {
      time += isPlaying ? 0.045 : 0.025;

      ctx.clearRect(0, 0, width, height);

      // ================= AURA =================

      const auraGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.8,
        centerX,
        centerY,
        radius * 1.4
      );

      auraGradient.addColorStop(
        0,
        isPlaying
          ? "rgba(168, 85, 247, 0.55)"
          : "rgba(168, 85, 247, 0.40)"
      );

      auraGradient.addColorStop(
        0.5,
        isPlaying
          ? "rgba(56, 189, 248, 0.35)"
          : "rgba(56, 189, 248, 0.20)"
      );

      auraGradient.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
      );

      ctx.fillStyle = auraGradient;

      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        radius * 1.4,
        0,
        Math.PI * 2
      );

      ctx.fill();

      // ================= SPHERE =================

      ctx.save();

      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
      );

      ctx.clip();

      const sphereGradient = ctx.createLinearGradient(
        centerX - radius * 0.5,
        centerY - radius,
        centerX + radius * 0.5,
        centerY + radius
      );

      sphereGradient.addColorStop(
        0,
        "#38bdf8"
      );

      sphereGradient.addColorStop(
        0.2,
        "#818cf8"
      );

      sphereGradient.addColorStop(
        0.55,
        "#a855f7"
      );

      sphereGradient.addColorStop(
        0.85,
        "#6b21a8"
      );

      sphereGradient.addColorStop(
        1,
        "#3b0764"
      );

      ctx.fillStyle = sphereGradient;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      // ================= INNER SHADOW =================

      const innerShadow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.35,
        centerX,
        centerY,
        radius
      );

      innerShadow.addColorStop(
        0,
        "rgba(0,0,0,0)"
      );

      innerShadow.addColorStop(
        0.85,
        "rgba(15,7,35,0.4)"
      );

      innerShadow.addColorStop(
        1,
        "rgba(5,2,15,0.8)"
      );

      ctx.fillStyle = innerShadow;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      // ================= WAVES =================

      const intensity = isPlaying ? 1.5 : 1;

      const waves = [
        {
          yOffset: -24,
          freq: 0.035,
          speed: 1.2,
          amp: 10 * intensity,
          color: "rgba(56,189,248,0.85)",
          width: 2,
        },

        {
          yOffset: -12,
          freq: 0.045,
          speed: -1.5,
          amp: 13 * intensity,
          color: "rgba(255,255,255,0.95)",
          width: 2.2,
        },

        {
          yOffset: 0,
          freq: 0.03,
          speed: 1.8,
          amp: 16 * intensity,
          color: "rgba(232,121,249,0.9)",
          width: 2.7,
        },

        {
          yOffset: 12,
          freq: 0.04,
          speed: -1.3,
          amp: 12 * intensity,
          color: "rgba(192,38,211,0.85)",
          width: 2,
        },

        {
          yOffset: 24,
          freq: 0.05,
          speed: 1.1,
          amp: 9 * intensity,
          color: "rgba(168,85,247,0.75)",
          width: 1.7,
        },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();

        ctx.strokeStyle = wave.color;

        ctx.lineWidth = wave.width;

        ctx.shadowColor = wave.color;

        ctx.shadowBlur = isPlaying ? 15 : 10;

        const startX = centerX - radius;

        const endX = centerX + radius;

        for (
          let x = startX;
          x <= endX;
          x += 1.5
        ) {
          const normalizedX =
            (x - startX) /
            (radius * 2);

          const edgeFactor =
            Math.sin(
              normalizedX * Math.PI
            );

          const y =
            centerY +
            wave.yOffset +
            Math.sin(
              x * wave.freq +
                time * wave.speed
            ) *
              wave.amp *
              edgeFactor +
            Math.cos(
              x * 0.02 -
                time * 0.8
            ) *
              4 *
              edgeFactor;

          if (x === startX) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      ctx.restore();

      // ================= OUTER RIM =================

      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        radius - 1,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "rgba(255,255,255,0.55)";

      ctx.lineWidth = 1.3;

      ctx.shadowColor = "#a855f7";

      ctx.shadowBlur = isPlaying
        ? 20
        : 12;

      ctx.stroke();

      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "rgba(56,189,248,0.4)";

      ctx.lineWidth = 1.7;

      ctx.shadowColor = "#38bdf8";

      ctx.shadowBlur = isPlaying
        ? 25
        : 17;

      ctx.stroke();

      ctx.shadowBlur = 0;

      animationFrameId =
        requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );
    };
  }, [isPlaying]);

  return (
    <div
      className={`relative flex items-center justify-center transition-transform duration-500 ${
        isPlaying
          ? "scale-105"
          : "scale-100"
      }`}
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 -m-7 rounded-full bg-gradient-to-tr from-purple-600/30 via-fuchsia-500/20 to-cyan-400/30 blur-3xl ${
          isPlaying
            ? "animate-pulse"
            : ""
        }`}
      />

      {/* Orb */}
      <canvas
        ref={canvasRef}
        style={{
          width: "220px",
          height: "220px",
        }}
        className="relative z-10 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]"
      />
    </div>
  );
};

export default SonarOrb;
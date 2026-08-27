import { useEffect, useRef } from "react";

const Visualizer = ({ isPlaying = false }) => {
  const barsRef = useRef([]);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  // Number of bars
  const barCount = 19;

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      // Control animation speed
      timeRef.current += delta * (isPlaying ? 0.008 : 0.004);

      barsRef.current.forEach((bar, index) => {
        if (!bar) return;

        /*
         * Create several overlapping sine waves.
         * This makes the visualizer feel organic rather
         * than every bar moving exactly the same way.
         */
        const wave1 = Math.sin(
          timeRef.current * 2.5 + index * 0.7
        );

        const wave2 = Math.sin(
          timeRef.current * 4 + index * 1.15
        );

        const wave3 = Math.cos(
          timeRef.current * 1.7 + index * 0.45
        );

        // Combine the waves
        let movement =
          wave1 * 0.45 +
          wave2 * 0.25 +
          wave3 * 0.2;

        /*
         * Bars in the middle should generally be taller,
         * matching the Figma waveform shape.
         */
        const centerDistance = Math.abs(
          index - (barCount - 1) / 2
        );

        const centerFactor =
          1 - centerDistance / ((barCount - 1) / 2);

        const baseHeight =
          7 + centerFactor * 13;

        const amplitude = isPlaying ? 10 : 4;

        const height =
          baseHeight + movement * amplitude;

        // Keep bars inside a reasonable range
        const clampedHeight = Math.max(
          3,
          Math.min(height, 24)
        );

        bar.style.height = `${clampedHeight}px`;
      });

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <div
      className={`
        flex
        h-[28px]
        items-center
        justify-center
        gap-[2px]
        transition-opacity
        duration-300
        ${isPlaying ? "opacity-100" : "opacity-90"}
      `}
    >
      {Array.from({ length: barCount }).map((_, index) => (
        <span
          key={index}
          ref={(element) => {
            barsRef.current[index] = element;
          }}
          className="
            block
            w-[2px]
            rounded-full
            bg-[#8B5CF6]
            transition-[height]
            duration-75
            ease-linear
          "
          style={{
            height: "8px",
          }}
        />
      ))}
    </div>
  );
};

export default Visualizer;
import { useState, useEffect, useRef } from "react";

interface TarkovClockProps {
  raidSide: "left" | "right";
}

const TarkovClock: React.FC<TarkovClockProps> = ({ raidSide }) => {
  const [tarkovTime, setTarkovTime] = useState(() => getTarkovTime(raidSide));
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const updateClock = () => {
      setTarkovTime(getTarkovTime(raidSide));
      animationFrameRef.current = requestAnimationFrame(updateClock);
    };

    animationFrameRef.current = requestAnimationFrame(updateClock);

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [raidSide]);

  function getTarkovTime(side: "left" | "right"): string {
    const now = Date.now(); // Current real-world time in milliseconds
    const tarkovRatio = 7; // Tarkov time runs 7x faster
    const oneDayMs = 24 * 60 * 60 * 1000;
    const moscowOffsetMs = 3 * 60 * 60 * 1000;
    const sideOffsetMs = side === "left" ? 0 : 12 * 60 * 60 * 1000;

    // Calculate Tarkov time in milliseconds
    const tarkovTimeMs =
      (now * tarkovRatio + moscowOffsetMs + sideOffsetMs) % oneDayMs;
    const tarkovDate = new Date(tarkovTimeMs);

    const hours = tarkovDate.getUTCHours().toString().padStart(2, "0");
    const minutes = tarkovDate.getUTCMinutes().toString().padStart(2, "0");
    const seconds = tarkovDate.getUTCSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="text-xl font-bold p-2 bg-gray-800 text-white rounded-md">
      {tarkovTime}
    </div>
  );
};

export default TarkovClock;

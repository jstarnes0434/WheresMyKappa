import { useState, useEffect } from "react";

interface TarkovClockProps {
  raidSide: "left" | "right";
}

const TarkovClock: React.FC<TarkovClockProps> = ({ raidSide }) => {
  const [tarkovTime, setTarkovTime] = useState(getTarkovTime(raidSide));

  useEffect(() => {
    const interval = setInterval(() => {
      setTarkovTime(getTarkovTime(raidSide));
    }, 1000);

    return () => clearInterval(interval);
  }, [raidSide]);

  function getTarkovTime(side: "left" | "right"): string {
    const now = new Date();
    const tarkovRatio = 7;
    const oneDayMs = 24 * 60 * 60 * 1000;
    const moscowOffsetMs = 3 * 60 * 60 * 1000;
    const sideOffsetMs = side === "left" ? 0 : 12 * 60 * 60 * 1000;

    const realTimeMs = now.getTime();
    const tarkovTimeMs =
      (realTimeMs * tarkovRatio + moscowOffsetMs + sideOffsetMs) % oneDayMs;

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

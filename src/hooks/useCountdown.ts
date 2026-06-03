import { useEffect, useState } from "react";

export function useCountdown(target: string | Date) {
  const targetTime =
    typeof target === "string" ? new Date(target).getTime() : target.getTime();

  const compute = () => {
    const diff = Math.max(0, targetTime - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      done: diff === 0,
    };
  };

  const [time, setTime] = useState(compute);

  useEffect(() => {
    const t = setInterval(() => setTime(compute()), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTime]);

  return time;
}